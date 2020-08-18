const fs = require('fs');
const htmlReport = require('./consolidateReport');
const Logger = require('../utils/logger');

const consolidateJsonReport = 'performance_reports//performance_report.json';
const consolidateHtmlReport = 'performance_reports//performance_report.html';

const addReportData = (jsonOutput, fileUrl) => {
  const reportResult = {
    testName: fileUrl,
    perfScore: jsonOutput.categories.performance.score * 100,
    reportLink: `${process.cwd()}/performance_reports/html/${fileUrl}`,
  };

  let jsonArray = [];
  if (fs.existsSync(consolidateJsonReport)) {
    jsonArray = JSON.parse(fs.readFileSync(consolidateJsonReport));
  }
  jsonArray.push(reportResult);
  fs.writeFileSync(consolidateJsonReport, JSON.stringify(jsonArray));
};

const generateReport = () => {
  if (fs.existsSync(consolidateJsonReport)) {
    const reportResults = JSON.parse(fs.readFileSync(consolidateJsonReport));
    const tableRows = reportResults.map((result) => {
      let perfScoreClass;
      if (result.perfScore >= 90 ) {
        perfScoreClass = 'perf_score_pass';
      } else if (result.perfScore >= 70) {
        perfScoreClass = 'perf_score_avg';
      } else {
        perfScoreClass = 'perf_score_fail';
      }
      const rows = `<tr>
        <td>${result.testName}</td>
        <td class=${perfScoreClass}><a target=${result.reportLink} href=${result.reportLink}>${result.perfScore}</a></td>
        </tr>`;
      return [rows];
    });
    try {
      fs.writeFileSync(consolidateHtmlReport, htmlReport(tableRows.join('')));
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
