const fs = require('fs');
const htmlReport = require('./report');
const Logger = require('../scripts/utils/logger');

let numberOfTestsPassed = 0;
let numberOfTestsFailed = 0;

const addReportData = (averageScore, extFileOutput, newFileOutput, fileUrl) => {
  const fileName = fileUrl.slice(0, fileUrl.lastIndexOf('(')); // removes session-id from url
  const reportResult = {
    testName: fileName,
    newPerfScore: newFileOutput.categories.performance.score * 100,
    extPerfScore: (extFileOutput) ? extFileOutput.categories.performance.score * 100 : averageScore,
    reportLink: `${process.cwd()}/report/html/${fileUrl}`,
  };

  let jsonAray = [];
  if (fs.existsSync('report//performance-report.json')) {
    jsonAray = JSON.parse(fs.readFileSync('report//performance-report.json'));
  }
  jsonAray.push(reportResult);
  fs.writeFileSync('report//performance-report.json', JSON.stringify(jsonAray));
};

const generateReport = (averageScore) => {
  const reportResults = JSON.parse(fs.readFileSync('report//performance-report.json'));
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
    fs.writeFileSync('report//performance-report.html', htmlReport(numberOfTestsFailed, numberOfTestsPassed, averageScore, tableRows.join('')));
    fs.unlinkSync('report//performance-report.json');
  } catch (e) {
    Logger.error(e);
  }
};

module.exports = {
  addReportData,
  generateReport,
};
