const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const lighthouseConfig = require('./lightHouseConfig');

async function launchChromeAndRunLighthouse(url, isMobileDevice) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = { output: 'html', port: chrome.port };

  const lighthouseResults = await lighthouse(url, options, lighthouseConfig(isMobileDevice));
  try {
    await chrome.kill();
  } catch (exception) {
    // continue regardless of error
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return {
      json: JSON.stringify(lighthouseResults.lhr, null, 2),
      html: lighthouseResults.report,
    };
  }
}

module.exports = launchChromeAndRunLighthouse;
