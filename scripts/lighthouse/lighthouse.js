const lighthouse = require('lighthouse');
const lighthouseConfig = require('./lightHouseConfig');
const Logger = require('../../scripts/utils/logger');

async function launchChromeAndRunLighthouse(url, isMobileDevice, chromePort) {
  const options = { output: 'html', port: chromePort };
  let lighthouseResults;
  try {
    lighthouseResults = await lighthouse(url, options, lighthouseConfig(isMobileDevice));
  } catch (e) {
    Logger.error(`lighthouse failed: ${e.message}`)
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return {
      json: JSON.stringify(lighthouseResults.lhr, null, 2),
      html: lighthouseResults.report,
    };
  }
}

module.exports = launchChromeAndRunLighthouse;
