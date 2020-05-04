const WDIOSpecReporter = require('wdio-spec-reporter/build/reporter');
const stripAnsi = require('strip-ansi');
const fs = require('fs');
const endOfLine = require('os').EOL;
const path = require('path');
const Logger = require('../../scripts/utils/logger');

const LOG_CONTEXT = '[Terra-Toolkit:terra-wdio-spec-reporter]';

class TerraWDIOSpecReporter extends WDIOSpecReporter {
  constructor(globalConfig, options) {
    super(globalConfig);
    this.runners = [];
    this.resultJsonObject = {
      startDate: '',
      type: 'wdio',
      locale: '',
      formFactor: '',
      theme: '',
      output: [],
      endDate: '',
    };
    if (!options.reporterDir) {
      this.filePath = path.resolve(__dirname, '..', '..', 'tests/wdio/reports/results');
    } else {
      this.filePath = options.reporterDir;
    }
    this.fileName = '';
    this.checkResultDirExist = this.checkResultDirExist.bind(this);
    this.checkResultDirExist();
    this.on('runner:end', (runner) => {
      this.runners.push(runner);
    });
  }

  hasReportDir() {
    const reportDir = path.resolve(this.filePath, '..');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir);
    }
  }

  checkResultDirExist() {
    if (this.filePath && !fs.existsSync(this.filePath)) {
      this.hasReportDir();
      fs.mkdirSync(this.filePath);
    }
  }

  fileNameCheck() {
    const { LOCALE, THEME, FORM_FACTOR } = process.env;
    const fileNameConf = [];
    if (LOCALE) {
      fileNameConf.push(LOCALE);
    }
    if (THEME) {
      fileNameConf.push(THEME);
    }
    if (FORM_FACTOR) {
      fileNameConf.push(FORM_FACTOR);
    }
    if (!fileNameConf.length) {
      this.fileName = '/result.json';
    }
    this.fileName = `/result-${fileNameConf.join('-')}.json`;
  }

  printSuitesSummary() {
    const { end, start } = this.baseReporter.stats;
    const { LOCALE, THEME, FORM_FACTOR } = process.env;
    this.resultJsonObject.endDate = new Date(end).toLocaleString();
    this.resultJsonObject.startDate = new Date(start).toLocaleString();
    this.resultJsonObject.locale = LOCALE;
    this.resultJsonObject.formFactor = FORM_FACTOR;
    this.resultJsonObject.theme = THEME || 'default-theme';
    const { runners } = this;
    if (runners && runners.length) {
      runners.forEach((runner) => {
        const readableMessage = `${stripAnsi(this.getSuiteResult(runner))}${endOfLine}`;
        if (readableMessage.search('\n') !== -1) {
          this.resultJsonObject.output.push(readableMessage.split(/\n/g));
        }
      });
    }
    this.fileNameCheck();
    fs.writeFileSync(`${this.filePath}${this.fileName}`, `${JSON.stringify(this.resultJsonObject, null, 2)}`, { flag: 'w+' }, (err) => {
      if (err) {
        Logger.error(err.message, { context: LOG_CONTEXT });
      }
    });
  }
}

module.exports = TerraWDIOSpecReporter;