const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function launchChromeAndRunLighthouse(url, isMobileDevice) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = { output: 'html', port: chrome.port };
  const customThrottling = {
    rttMs: 150,
    throughputKbps: 10 * 1024,
    cpuSlowdownMultiplier: 4,
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
