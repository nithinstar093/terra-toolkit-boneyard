const fs = require('fs');

const reportResults = [];
let numberOfTestsPassed = 0;
let numberOfTestsFailed = 0;

const addReportData = (newData, extData, reportLink, testName, fileName) => {
  const result = {};
  result.componentName = fileName;
  result.reportLink = reportLink;
  result.testName = testName;
  result.newperfScore = newData && newData.categories.performance.score * 100;
  result.extPerfScore = extData && extData.categories.performance.score * 100;
  reportResults.push(result);
  if (reportLink) {
    numberOfTestsFailed += 1;
  } else {
    numberOfTestsPassed += 1;
  }
};

const generateReport = () => {
  const doc = document.implementation.createHTMLDocument('Light House Report');
  const div = doc.createElement('div');
  const passedHeader = doc.createElement('p');
  const failedHeader = doc.createElement('p');
  passedHeader.innerHTML = `Number of tests passed performance score : ${numberOfTestsPassed}`;
  failedHeader.innerHTML = `Number of tests failed performance score : ${numberOfTestsFailed}`;
  div.appendChild(passedHeader);
  div.appendChild(failedHeader);
  let previousFile;
  const header = doc.createElement('h2');
  reportResults.forEach((result) => {
    if (previousFile !== result.fileName) {
      header.innerHTML = result.fileName;
      div.appendChild(header);
    }
    const li = doc.createElement('li');
    const anchor = doc.createElement('a');
    anchor.target = result.reportLink;
    li.innerHTML = `<br /> Performance Score of Test : ${result.testName} is <br />  New Score : <b>${result.newperfScore}</b> 
    <br /> Existing Score : <b>${result.extPerfScore}</b> <br /> ${anchor}`;
    div.appendChild(li);
    previousFile = result.fileName;
  });

  try {
    doc.body.appendChild(div);
    if (!fs.existsSync('report')) {
      fs.mkdirSync('report');
    }
    fs.writeFileSync('report//performancereport.html', doc);
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  generateReport,
  addReportData,
};

