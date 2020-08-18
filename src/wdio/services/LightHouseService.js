const fs = require('fs');
const launchChromeAndRunLighthouse = require('../../../scripts/lighthouse/lighthouse');
const { addReportData, generateReport } = require('../../../scripts/lighthouse/reportGenerator');
const { terraViewports } = require('../../../config/wdio/services.default-config');

const rootDir = 'performance_reports';
const htmlRootDir = 'performance_reports/html';
let viewPortSize;

export default class LightHouseService {
  before() {
    if (fs.existsSync(rootDir)) {
      const files = fs.readdirSync(htmlRootDir)
      if (files.length > 0) {
        files.forEach((filename) => {
          fs.unlinkSync(`${htmlRootDir}//${filename}`);
        });
      }
      fs.rmdirSync(htmlRootDir);
      fs.rmdirSync(rootDir);
    }
    viewPortSize =  global.browser.getViewportSize().width;
  }

  async afterTest(test) {
    const url = await global.browser.getUrl();
    const isMobileDevice = (viewPortSize <= terraViewports.small.width);
    let fileName = (isMobileDevice) ? test.fullTitle.replace(/tiny|small/gi, 'Mobile') : test.fullTitle.replace(/medium|large|huge|enormous/gi, 'Desktop');
    fileName = fileName.replace('-is-accessible-and-is-within-the-mismatch-tolerance', '').trim();
    const htmlFileUrl = `${fileName.replace(/ /g, '_')}.html`;

    if (!fs.existsSync(rootDir)) fs.mkdirSync(rootDir);

    if (!fs.existsSync(htmlRootDir)) fs.mkdirSync(htmlRootDir);

    // Skips running tests for multiple viewports
    if (!fs.existsSync(`${htmlRootDir}//${htmlFileUrl}`)) {
        const results = await launchChromeAndRunLighthouse(url, isMobileDevice);
        fs.writeFileSync(`${htmlRootDir}//${htmlFileUrl}`, results.html);
        addReportData(JSON.parse(results.json), htmlFileUrl);
    }
  }

  onComplete() {
    generateReport();
  }
};