const lighthouse = require('lighthouse');
const lighthouseConfig = require('./lightHouseConfig');

let selniumChromeHost;
const selniumChromePort = 5555;

const setPort = (host) => {
  selniumChromeHost = host;
};

async function launchChromeAndRunLighthouse(url, isMobileDevice, chromePort) {
  const options = (selniumChromeHost) ? { output: 'html', port: selniumChromePort, host: selniumChromeHost } : { output: 'html', port: chromePort };

  const lighthouseResults = await lighthouse(url, options, lighthouseConfig(isMobileDevice));
  try {
    // await chrome.kill();
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



module.exports = {
  launchChromeAndRunLighthouse,
  setPort,
};
