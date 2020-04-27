const WDIOSpecReporter = require('wdio-spec-reporter/build/reporter');
const jsonMultilineStrings = require('json-multiline-strings');
const stripAnsi = require('strip-ansi');
const fs = require('fs');
const path = require('path');

const jsonFilePath = path.resolve(__dirname, './result.json');
const resultData = {};
class WdioCustomeReporter extends WDIOSpecReporter {
  constructor(globalConfig, options) {
    super(globalConfig);
    this.isSpecStarted = false;
    this.options = options;
    this.runners = [];
    this.on('runner:end', (runner) => {
      this.runners.push(runner);
    });
  }

  printSuitesSummary() {
    const { runners } = this;
    if (runners && runners.length) {
      runners.forEach((runner) => {
        const endDate = new Date(this.baseReporter.stats.end).toLocaleString();
        const startDate = new Date(this.baseReporter.stats.start).toLocaleString();
        const jsonObject = {
          startDate,
          type: 'wdio',
          theme: process.env.THEME || 'default-theme',
          locale: process.env.LOCALE,
          formFactor: process.env.FORM_FACTOR,
          result: stripAnsi(this.getSuiteResult(runner)),
          endDate,
        };
        if (!resultData[runner.specHash]) {
          resultData[runner.specHash] = [];
        }
        resultData[runner.specHash].push(jsonObject);
      });
      fs.writeFileSync(jsonFilePath, `${JSON.stringify(jsonMultilineStrings.split(resultData), null, 2)}\n\n`, (err) => {
        if (err) {
          console.log(`File Error -> ${err.message}`);
        }
      });
    }
  }
}

module.exports = WdioCustomeReporter;
