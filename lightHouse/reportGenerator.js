const fs = require('fs');
const htmlReport = require('./report');
const Logger = require('../scripts/utils/logger');

let numberOfTestsPassed = 0;
let numberOfTestsFailed = 0;

const consolidateJsonReport = `${process.cwd()}/performance_reports/performance_report.json`;
const consolidateHtmlReport = `${process.cwd()}/performance_reports//performance_report.html`;

const addReportData = (averageScore, extFileOutput, newFileOutput, fileUrl) => {
  const fileName = fileUrl.slice(0, fileUrl.lastIndexOf('(')); // removes session-id from url
  const reportResult = {
    testName: fileName,
    newPerfScore: newFileOutput.categories.performance.score * 100,
    extPerfScore: (extFileOutput) ? extFileOutput.categories.performance.score * 100 : averageScore,
    reportLink: `${process.cwd()}/performance_reports/html/${fileUrl}`,
  };

  let jsonArray = [];
  if (fs.existsSync(consolidateJsonReport)) {
    jsonArray = JSON.parse(fs.readFileSync(consolidateJsonReport));
  }
  jsonArray.push(reportResult);
  fs.writeFileSync(consolidateJsonReport, JSON.stringify(jsonArray));
};

const generateReport = (averageScore) => {
  if (fs.existsSync(consolidateJsonReport)) {
    const reportResults = JSON.parse(fs.readFileSync(consolidateJsonReport));
    const tableRows = reportResults.map((result) => {
      let perfScoreClass;
      if (result.newPerfScore === result.extPerfScore) {
        perfScoreClass = 'perf_score_avg';
        numberOfTestsPassed += 1;
      } else if (result.newPerfScore > result.extPerfScore) {
        perfScoreClass = 'perf_score_pass';
        numberOfTestsPassed += 1;
      } else {
        perfScoreClass = 'perf_score_fail';
        numberOfTestsFailed += 1;
      }
      const status = (perfScoreClass === 'perf_score_fail') ? 'fail' : 'pass';
      const rows = `<tr>
        <td>${result.testName}</td>
        <td>${result.extPerfScore}</td>
        <td class=${perfScoreClass}><a target=${result.reportLink} href=${result.reportLink}>${result.newPerfScore}</a></td>
        <td class=${(status === 'fail') ? 'fail_status' : 'pass_status'}>${status}</td>
        </tr>`;
      return [rows];
    });
    try {
      fs.writeFileSync(consolidateHtmlReport, htmlReport(numberOfTestsFailed, numberOfTestsPassed, averageScore, tableRows.join('')));
      fs.unlinkSync(consolidateJsonReport);
    } catch (e) {
      Logger.error('ERROR While generating Lighthouse Consolidate Report :',e);
    }
  }
};

module.exports = {
  addReportData,
  generateReport,
};
