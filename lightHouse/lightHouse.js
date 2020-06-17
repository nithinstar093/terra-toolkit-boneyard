const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function launchChromeAndRunLighthouse(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = { output: 'html', onlyCategories: ['performance'], port: chrome.port };
  const lighthouseResults = await lighthouse(url, options);
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
