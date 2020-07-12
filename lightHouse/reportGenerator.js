const fs = require('fs');
const htmlReport = require('./report');
const Logger = require('../scripts/utils/logger');

let numberOfTestsPassed = 0;
let numberOfTestsFailed = 0;

const addReportData = (averageScore, extFileOutput, newFileOutput, fileUrl, testStatus) => {
  const reportResult = {};
  const fileName = fileUrl.slice(0, fileUrl.lastIndexOf('('));
  reportResult.test = fileUrl;
  reportResult.test = {
    testName: fileName.includes('--Mhouse') ? fileName.replace('--Mhouse', 'Mobile') : fileName.replace('--Dhouse', 'Desktop'),
    newPerfScore: newFileOutput.categories.performance.score * 100,
    extPerfScore: (extFileOutput) ? extFileOutput.categories.performance.score * 100 : averageScore,
    reportLink: `${process.cwd()}/report/html/${fileUrl}`,
    status: (testStatus) ? 'Pass' : 'Fail',
  };
  fs.appendFileSync('report//performance-report.json', JSON.stringify(reportResult));
};

const generateReport = (averageScore) => {
  let reportResults;
  fs.readFile('report//performance-report.json', (err, data) => {
    if (err) Logger.error(err);
    reportResults = JSON.parse(data);
  });
  const tableRows = reportResults.map((result) => {
    let perfScoreClass;
    if (result.test.perfScore === result.extPerfScore) {
      perfScoreClass = 'perf_score_avg';
      numberOfTestsPassed += 1;
    } else if (result.perfScore > result.extPerfScore) {
      perfScoreClass = 'perf_score_pass';
      numberOfTestsPassed += 1;
    } else {
      perfScoreClass = 'perf_score_fail';
      numberOfTestsFailed += 1;
    }
    const rows = `<tr>
      <td>${result.test.testName}</td>
      <td>${result.test.extPerfScore}</td>
      <td class=${perfScoreClass}><a target=${result.test.reportLink} href=${result.test.reportLink}>${result.test.perfScore}</a></td>
      <td class=${(result.test.status) ? 'pass_status' : 'fail_status'}>${result.test.status}</td>
    </tr>`;
    return [rows];
  });
  try {
    fs.writeFileSync('report//performance-report.html', htmlReport(numberOfTestsFailed, numberOfTestsPassed, averageScore, tableRows));
  } catch (e) {
    Logger.error(e);
  }
};

module.exports = {
  addReportData,
  generateReport,
};
