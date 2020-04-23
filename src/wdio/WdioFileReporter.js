/* eslint-disable class-methods-use-this */
// eslint-disable
// eslint-disable-next-line import/no-unresolved
const WDIOSpecReporter = require('wdio-spec-reporter/build/reporter');

const stripAnsi = require('strip-ansi');
const fs = require('fs');
const path = require('path');

// const filePath = path.resolve(__dirname, '../../tests/wdio/_snapshots_/WdioTestResults.txt');
const filePath = path.resolve(__dirname, './WdioTestResults.txt');

class WdioCustomeReporter extends WDIOSpecReporter {
  constructor(options) {
    /*
     * make reporter to write to the output stream by default
     */
    const newoptions = Object.assign(options, { stdout: true });
    super(newoptions);
    this.isSpecStarted = false;
  }

  printSpecStart(start) {
    let content = '=======================================\n';
    content += start;
    return content;
  }

  printSuiteResult(runner) {
    //  console.log('*****', this.getSuiteResult(runner));
    let content = '';
    if (!this.isSpecStarted) {
      content += this.printSpecStart(this.baseReporter.stats.start);
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
    /**
     * no need to print summary if only one runner was executed
     */
    if (specCount === 1) {
      return;
    }
    // eslint-disable-next-line prefer-destructuring
    const epilogue = this.baseReporter.epilogue;
    //  const startDate = this.WdioCustomeReporter.baseReporter.stats.start;
    const endDate = this.baseReporter.stats.end;
    console.log('end date', endDate);
    const content = this.getSuitesSummary(specCount);
    //  console.log('start', this, 'end');
    fs.appendFileSync(filePath, `${content}\n\n`, (err) => {
      if (err) {
        console.log('err', err);
      }
    });
    fs.appendFileSync(filePath, `\n ${endDate}\n\n`, (err1) => {
      if (err1) {
        console.log('err1', err1);
      }
    });
    epilogue.call(this.baseReporter);
  }

  // eslint-disable-next-line class-methods-use-this
  // getSuitesSummary(specCount) {
  //   //  const output = '\n\n==================================================================\n';
  //   //  cont output += 'Number of specs: ' + specCount;
  //   console.log('specCount', specCount);
  //   fs.appendFile(filePath, `${specCount}`, (err) => {
  //     if (err) {
  //       console.log('err', err);
  //     }
  //     console.log('done');
  //   });
  // }

  // printSuitesSummary() {
  //   const specCount = Object.keys(this.baseReporter.stats.runners).length;

  //   /**
  //    * no need to print summary if only one runner was executed
  //    */
  //   if (specCount === 1) {
  //     return;
  //   }

  //   // eslint-disable-next-line prefer-destructuring
  //   const epilogue = this.baseReporter.epilogue;
  //   console.log('getSuitSummary', this.getSuitesSummary(specCount), this);
  //   epilogue.call(this.baseReporter);
  // }
}

module.exports = WdioCustomeReporter;
