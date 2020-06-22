const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function launchChromeAndRunLighthouse(url, viewport) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = { output: 'html', port: chrome.port };
  const isMobileDevice = viewport.includes('tiny') || viewport.includes('small');
  const throughputKbps = 10 * 1024;
  const customThrottling = {
    rttMs: (isMobileDevice) ? 150 : 40,
    throughputKbps: (isMobileDevice) ? throughputKbps / 2 : throughputKbps,
    cpuSlowdownMultiplier: (isMobileDevice) ? 4 : 1,
    requestLatencyMs: 0, // 0 means unset
    downloadThroughputKbps: 0,
    uploadThroughputKbps: 0,
  };

  const lightHouseConfig = {
    extends: 'lighthouse:default',
    settings: {
      onlyCategories: ['performance'],
      useThrottling: true,
      recordTrace: true,
      emulatedFormFactor: (isMobileDevice) ? 'mobile' : 'desktop',
      throttling: customThrottling,
      // Skip the h2 audit so it doesn't lie to us. See https://github.com/GoogleChrome/lighthouse/issues/6539
      skipAudits: ['uses-http2'],
    },
  };

  const lighthouseResults = await lighthouse(url, options, lightHouseConfig);
  try {
    await chrome.kill();
  } catch (exception) {
    // continue regardless of error
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return {
      json: lighthouseResults.lhr,
      html: lighthouseResults.report,
    };
  }
}

module.exports = launchChromeAndRunLighthouse;
