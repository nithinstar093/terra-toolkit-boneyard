const fs = require('fs-extra')
const launchChromeAndRunLighthouse = require('../../../scripts/lighthouse/lighthouse');
const { addReportData, generateReport } = require('../../../scripts/lighthouse/reportGenerator');

const rootDir = 'performance_reports';
const htmlRootDir = 'performance_reports/html';
const consolidateHtmlReport = `${rootDir}/performance_report.html`;

/* Use to override default theme for theme visual regression tests. */
const theme = process.env.THEME;

export default class LightHouseService {
  before() {
    // clears the previous report only for default theme. To prevent performance test from running for multiple themes.
    if (fs.existsSync(rootDir) && theme === undefined) {
      fs.removeSync(rootDir);
    }
  }

  async beforeTest(test) {
    const url = await global.browser.getUrl();
    const isMobileDevice = test.fullTitle.includes('tiny') || test.fullTitle.includes('small');
    let fileName = test.fullTitle.replace('is accessible and is within the mismatch tolerance', '').trim();
    fileName = (isMobileDevice) ? fileName.replace(/tiny|small/gi, 'Mobile') : fileName.replace(/medium|large|huge|enormous/gi, 'Desktop');
    const htmlFileUrl = `${fileName.replace(/ /g, '_')}.html`;

    if (!fs.existsSync(rootDir)) fs.mkdirSync(rootDir);

    if (!fs.existsSync(htmlRootDir)) fs.mkdirSync(htmlRootDir);

    // Skips running tests for multiple viewports
    if (!fs.existsSync(`${htmlRootDir}/${htmlFileUrl}`)) {
        const results = await launchChromeAndRunLighthouse(url, isMobileDevice);
        fs.writeFileSync(`${htmlRootDir}/${htmlFileUrl}`, results.html);
        addReportData(JSON.parse(results.json), htmlFileUrl);
    }
  }

  onComplete() {
    generateReport(consolidateHtmlReport);
  }
};