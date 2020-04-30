const WDIOSpecReporter = require('wdio-spec-reporter/build/reporter');
const stripAnsi = require('strip-ansi');
const fs = require('fs');
// const path = require('path');
const endOfLine = require('os').EOL;

// const jsonFilePath = path.resolve(__dirname, '../../tests/wdio/reports/results/');
class WdioCustomeReporter extends WDIOSpecReporter {
  constructor(globalConfig, options) {
    super(globalConfig);
    this.runners = [];
    this.on('runner:end', (runner) => {
      this.runners.push(runner);
    });
    this.resultJsonObject = {
      startDate: '',
      type: 'wdio',
      locale: '',
      formFactor: '',
      theme: '',
      Output: [],
      endDate: '',
    };
    this.filePath = options.reporterDir;
  }

  printSuitesSummary() {
    this.resultJsonObject.endDate = new Date(this.baseReporter.stats.end).toLocaleString();
    this.resultJsonObject.startDate = new Date(this.baseReporter.stats.start).toLocaleString();
    this.resultJsonObject.locale = process.env.LOCALE;
    this.resultJsonObject.formFactor = process.env.FORM_FACTOR;
    this.resultJsonObject.theme = process.env.THEME || 'default-theme';
    const { runners } = this;
    if (runners && runners.length) {
      runners.forEach((runner) => {
        const readableMessage = `${stripAnsi(this.getSuiteResult(runner))}${endOfLine}`;
        if (readableMessage.search('\n') !== -1) {
          this.resultJsonObject.Output.push(readableMessage.split(/\n/g));
        }
      });
    }
    const fileName = `/result-${process.env.LOCALE || '-'}${process.env.THEME || '-'}${process.env.FORM_FACTOR}.json`;
    fs.writeFileSync(`${this.filePath}${fileName}`, `${JSON.stringify(this.resultJsonObject, null, 2)}`, { flag: 'a+' }, (err) => {
      if (err) {
        console.log(`File Error -> ${err.message}`);
      }
    });
    this.resultJsonObject = {};
  }
}

module.exports = WdioCustomeReporter;
