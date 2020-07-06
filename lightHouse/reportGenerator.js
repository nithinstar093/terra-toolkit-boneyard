const fs = require('fs');
const Logger = require('../scripts/utils/logger');

let numberOfTestsPassed = 0;
let numberOfTestsFailed = 0;

const addReportData = () => {
  const reportResults = [];
  if (fs.existsSync('report//json//')) {
    const jsconFileNames = fs.readdirSync('report//json//');
    jsconFileNames.forEach((file) => {
      const JsonOutput = JSON.parse(fs.readFileSync(`report//json//${file}`));
      const htmlURL = file.replace('.json', '.html');
      const result = {};
      result.fileName = file.includes('--Mhouse') ? file.replace('--Mhouse', 'Mobile') : file.replace('--Dhouse', 'Desktop');
      result.reportLink = (fs.existsSync(`report//html//${htmlURL}`)) ? `${process.cwd()}/report/html/${htmlURL}` : 'NA';
      result.perfScore = (JsonOutput) ? JsonOutput.categories.performance.score * 100 : 'NA';
      reportResults.push(result);
      if (result.reportLink === 'NA') {
        numberOfTestsPassed += 1;
      } else {
        numberOfTestsFailed += 1;
      }
    });
  }
  return reportResults;
};

const generateReport = () => {
  const reportResults = addReportData();
  const tableRows = reportResults.map((result) => {
    const rows = `<tr>
      <td>${result.fileName}</td>
      <td>${result.perfScore}</td>
      <td><a target=${result.reportLink} href=${result.reportLink}>${result.reportLink}</a></td>
    </tr>`;
    return [rows];
  });

  const reportHtml = `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">
        <title>Lighthouse Report</title>
        <style>
          .header {
            border: 1px solid #BFBFBF;
            background-color: #014979;
            box-shadow: 0px 0px 2px 1px #aaaaaa;
            color: #fff;
            font-family: arial, sans-serif;
            font-weight: bold;    
            text-align: center;
            width: 100%;
          }
          table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
          }

          th {
            background: #f1f1f2;
            border: 2px solid #bfbebe;
            text-align: left;
            padding: 8px;
          }

          td{
            border: 1px solid #bfbebe;
            text-align: left;
            padding: 8px;
          }

          tr:nth-child(even) {
            background-color: #f3f3f3;
          }
       </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h4> Light House Consildate Report </h4>
            <p> Number of tests passed performance score : ${numberOfTestsPassed} </p>
            <p> Number of tests failed performance score : ${numberOfTestsFailed} </p>
          </div>
          <table>
            <tr>
              <th>TestName</th>
              <th>PerfScore</th>
              <th>Link</th>
            </tr>
            ${tableRows}
          </table>
        </div>
      </body>
    </html>`;

  try {
    if (!fs.existsSync('report')) {
      fs.mkdirSync('report');
    }
    fs.writeFileSync('report//performance-report.html', reportHtml);
  } catch (e) {
    Logger.error(e);
  }
};

module.exports = {
  generateReport,
};
