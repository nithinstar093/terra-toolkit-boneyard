const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function launchChromeAndRunLighthouse(url, opts = chrome.port, config = null) {
  const chrome = await chromeLauncher.launch({ chromeFlags: opts.chromeFlags });
  const lighthouseResults = await lighthouse(url, opts, config);
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
