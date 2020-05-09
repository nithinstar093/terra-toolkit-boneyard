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
    this.options = options;
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
    if (options.reporterOptions && options.reporterOptions.outputDir) {
      this.filePath = options.reporterOptions.outputDir;
    } else {
      this.filePath = path.join(process.cwd(), '/tests/wdio/reports/results');
    }
    this.fileName = '';
    this.hasReportDir = this.hasReportDir.bind(this);
    this.hasReportDir();
    this.on('runner:end', (runner) => {
      this.runners.push(runner);
    });
  }

  hasReportDir() {
    const reportDir = path.join(this.filePath, '..');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(this.filePath, { recursive: true }, (err) => {
        if (err) throw err;
      });
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
    if (fileNameConf.length === 0) {
      this.fileName = '/result.json';
    }
    if (fileNameConf.length >= 1) {
      this.fileName = `/result-${fileNameConf.join('-')}.json`;
    }
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
