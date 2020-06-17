const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function launchChromeAndRunLighthouse(url, config) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = { output: 'html', port: chrome.port };
  const lighthouseResults = await lighthouse(url, options, config);
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
