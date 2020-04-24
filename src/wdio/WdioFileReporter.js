/* eslint-disable prefer-rest-params */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable class-methods-use-this */
const WDIOSpecReporter = require('wdio-spec-reporter/build/reporter');

const stripAnsi = require('strip-ansi');
const fs = require('fs');
const path = require('path');

// const filePath = path.resolve(__dirname, '../../tests/wdio/_snapshots_/WdioTestResults.txt');
const filePath = path.resolve(__dirname, './WdioTestResults.txt');
//  const jsonFilePath = path.resolve(__dirname, './result.json');

class WdioCustomeReporter extends WDIOSpecReporter {
  constructor(globalConfig, options) {
    // console.log('GLOBAL CONFIG', process.env.FORM_FACTOR);
    // console.log('OPTIONS: ', options);
    super(globalConfig);
    this.isSpecStarted = false;
    this.options = options;
  }

  printSpecStart(startDate) {
    let content = '=======================================\n';
    content += startDate;
    return content;
  }

  printSuiteResult(runner) {
    // console.log('RUNNER: ', this.options.formFactor);
    let content = '';
    if (!this.isSpecStarted) {
      const startDate = `Start Date: ${new Date(this.baseReporter.stats.start).toLocaleString()}\n`;
      content += this.printSpecStart(startDate);
      this.isSpecStarted = true;
    }
    content += this.getSuiteResult(runner);
    fs.appendFileSync(filePath, `${stripAnsi(content)}\n`, (err) => {
      if (err) {
        throw err;
      }
    });
  }

  printSuitesSummary() {
    const specCount = Object.keys(this.baseReporter.stats.runners).length;
    if (specCount === 1) {
      return;
    }
    const endDate = new Date(this.baseReporter.stats.end).toLocaleString();
    let content = this.getSuitesSummary(specCount);
    content += `\n\nEnd Date: ${endDate}\n`;
    fs.appendFileSync(filePath, `${content}\n\n`, (err) => {
      if (err) {
        console.log(`File Error -> ${err.message}`);
      }
    });
  }

  // getResultList(cid, ...suites) {
  //   const preface = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

  //   let output = '';

  //   for (const specUid in suites) {
  //     // Remove "before all" tests from the displayed results
  //     if (specUid.indexOf('"before all"') === 0) {
  //       continue;
  //     }

  //     const spec = suites[specUid];
  //     const indent = this.indent(cid, specUid);
  //     const specTitle = suites[specUid].title;

  //     if (specUid.indexOf('"before all"') !== 0) {
  //       // output += `${preface} ${indent}${specTitle}\n`;
  //       output += `${specTitle}\n`;
  //     }
  //     for (const testUid in spec.tests) {
  //       const test = spec.tests[testUid];
  //       const testTitle = spec.tests[testUid].title;

  //       if (test.state === '') {
  //         continue;
  //       }

  //       // output += preface;
  //       output += `   ${indent}`;
  //       output += this.chalk[this.getColor(test.state)](this.getSymbol(test.state));
  //       output += `  ${testTitle} \n`;
  //     }
  //     output += `${preface.trim()} \n`;
  //   }
  //   const result = {
  //     // eslint-disable-next-line object-shorthand
  //     output: output.split('\n'),
  //   };
  //   console.log('Result: ', result);
  //   fs.appendFileSync(jsonFilePath, `${JSON.stringify(stripAnsi(result))}\n`, (err) => {
  //     if (err) {
  //       throw err;
  //     }
  //   });

  //   //  return output;
  // }
}

module.exports = WdioCustomeReporter;
