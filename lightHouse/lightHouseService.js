const fs = require('fs');
const launchChromeAndRunLighthouse = require('./lightHouse');
const { generateSessionToken, getSessionToken, validateSession } = require('./sessionHelper');
const { compareReports } = require('./reportCompareHelper');
const { addReportData, generateReport } = require('./reportGenerator');

/* Use to enable running light house performance against each test. */
const runLightHouse = process.env.RUN_LIGHT_HOUSE || true;

/* Use to set average performance score to validate light house reports. */
const averagePerformanceScore = process.env.AVERAGE_PERFORMANCE_SCORE || 75;

const lightHouseService = {
  before() {
    if (runLightHouse) generateSessionToken();
  },

  async afterTest(test) {
    if (runLightHouse) {
      const url = await global.browser.getUrl();
      const isMobileDevice = test.fullTitle.includes('tiny') || test.fullTitle.includes('small');
      let fileName = test.fullTitle.replace('-is-accessible-and-is-within-the-mismatch-tolerance', '').trim();
      fileName = (isMobileDevice) ? fileName.replace(/tiny|small/gi, 'Mobile')
        : fileName.replace(/medium|large|huge|enormous/gi, 'Desktop');
      const htmlFileUrl = `${fileName.replace(/ /g, '-')}${getSessionToken()}.html`;
      const jsonFileUrl = `${fileName.replace(/ /g, '-')}${getSessionToken()}.json`;

      if (!fs.existsSync('report')) {
        fs.mkdirSync('report');
      }

      if (!fs.existsSync('report/html')) {
        fs.mkdirSync('report/html');
      }

      if (!fs.existsSync('report/json')) {
        fs.mkdirSync('report/json');
      }

      // Skips running tests for multiple viewports
      if (!fs.existsSync(`report//json//${jsonFileUrl}`)) {
        const results = await launchChromeAndRunLighthouse(url, isMobileDevice);
        const newReportOutput = JSON.parse(results.json);
        let extReportOutput;
        const fileNames = fs.readdirSync('report//json//');
        if (fileNames.length > 0) {
          fileNames.forEach((extfileUrl) => {
            // check if previous report exist. if true creates report only when there is difference between current and previous report.
            if (validateSession(extfileUrl, jsonFileUrl)) {
              extReportOutput = JSON.parse(fs.readFileSync(`report//json//${extfileUrl}`));
              if (compareReports(newReportOutput, extReportOutput, test.fullTitle)) {
                fs.writeFileSync(`report//html//${htmlFileUrl}`, results.html);
                fs.writeFileSync(`report//json//${jsonFileUrl}`, results.json);
                addReportData(averagePerformanceScore, extReportOutput, newReportOutput, htmlFileUrl);
                fs.unlinkSync(`report//json//${extfileUrl}`);
                fs.unlinkSync(`report//html//${extfileUrl.replace('.json', '.html')}`);
              }
            }
          });
        }
        // Prevents re-writing of existing report if there are no changes in performance score.
        if (extReportOutput === undefined) {
          fs.writeFileSync(`report//html//${htmlFileUrl}`, results.html);
          fs.writeFileSync(`report//json//${jsonFileUrl}`, results.json);
          addReportData(averagePerformanceScore, extReportOutput, newReportOutput, htmlFileUrl);
        }
      }
    }
  },

  onComplete() {
    if (runLightHouse) generateReport(averagePerformanceScore);
  },
};

export default lightHouseService;
