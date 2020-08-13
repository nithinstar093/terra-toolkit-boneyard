const fs = require('fs');
const launchChromeAndRunLighthouse = require('../../../lightHouse/lightHouse');
const { generateSessionToken, getSessionToken, compareFileName } = require('../../../lightHouse/sessionHelper');
const { compareReports } = require('../../../lightHouse/reportCompareHelper');
const { addReportData, generateReport } = require('../../../lightHouse/reportGenerator');

/* Use to enable running light house performance against each test. */
const runLightHouse = process.env.RUN_LIGHT_HOUSE || true;

/* Use to set average performance score to validate light house reports. */
const averagePerformanceScore = process.env.AVERAGE_PERFORMANCE_SCORE || 75;

const rootDir = 'performance_reports';
const htmlRootDir = 'performance_reports/html';
const jsonRootDir = 'performance_reports/json';

export default class LightHouseService {
  before() {
    if (runLightHouse) generateSessionToken();
  }

  async afterTest(test) {
    if (runLightHouse) {
      const url = await global.browser.getUrl();
      const isMobileDevice = test.fullTitle.includes('tiny') || test.fullTitle.includes('small');
      let fileName = test.fullTitle.replace('-is-accessible-and-is-within-the-mismatch-tolerance', '').trim();
      fileName = (isMobileDevice) ? fileName.replace(/tiny|small/gi, 'Mobile')
        : fileName.replace(/medium|large|huge|enormous/gi, 'Desktop');
      const htmlFileUrl = `${fileName.replace(/ /g, '_')}${getSessionToken()}.html`;
      const jsonFileUrl = `${fileName.replace(/ /g, '_')}${getSessionToken()}.json`;

      if (!fs.existsSync(rootDir)) {
        fs.mkdirSync(rootDir);
      }

      if (!fs.existsSync(htmlRootDir)) {
        fs.mkdirSync(htmlRootDir);
      }

      if (!fs.existsSync(jsonRootDir)) {
        fs.mkdirSync(jsonRootDir);
      }

      // Skips running tests for multiple viewports
      if (!fs.existsSync(`${jsonRootDir}//${jsonFileUrl}`)) {
        const results = await launchChromeAndRunLighthouse(url, isMobileDevice);
        const newReportOutput = JSON.parse(results.json);
        let extReportOutput;
        const fileNames = fs.readdirSync(`${jsonRootDir}//`);
        if (fileNames.length > 0) {
          fileNames.forEach((extfileUrl) => {
            // check if previous report exist.
            if (compareFileName(extfileUrl, jsonFileUrl)) {
              extReportOutput = JSON.parse(fs.readFileSync(`${jsonRootDir}//${extfileUrl}`));
              // create report only when current performance score is different from previous performance score.
              if (compareReports(newReportOutput, extReportOutput, averagePerformanceScore)) {      
                fs.writeFileSync(`${htmlRootDir}//${htmlFileUrl}`, results.html);
                fs.writeFileSync(`${jsonRootDir}//${jsonFileUrl}`, results.json);
                addReportData(averagePerformanceScore, extReportOutput, newReportOutput, htmlFileUrl);
                fs.unlinkSync(`${jsonRootDir}//${extfileUrl}`);
                fs.unlinkSync(`${htmlRootDir}//${extfileUrl.replace('.json', '.html')}`);
              }
            }
          });
        }
        // Prevents re-writing of existing report if there are no changes in performance score.
        if (extReportOutput === undefined) {
          fs.writeFileSync(`${htmlRootDir}//${htmlFileUrl}`, results.html);
          fs.writeFileSync(`${jsonRootDir}//${jsonFileUrl}`, results.json);
          addReportData(averagePerformanceScore, extReportOutput, newReportOutput, htmlFileUrl);
        }
      }
    }
  }

  onComplete() {
    if (runLightHouse) generateReport(averagePerformanceScore);
  }
};
