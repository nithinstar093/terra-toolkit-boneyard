const WDIOSpecReporter = require('wdio-spec-reporter/build/reporter');
const stripAnsi = require('strip-ansi');
const fs = require('fs');
const endOfLine = require('os').EOL;
const Logger = require('../../scripts/utils/logger');

const LOG_CONTEXT = '[Terra-Toolkit:theme-aggregator]';

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
      output: [],
      endDate: '',
    };
    this.filePath = options.reporterDir;
    this.fileName = '';
  }

  fileNameCheck() {
    if (process.env.LOCALE === undefined && process.env.THEME === undefined && process.env.LOCALE === undefined) {
      this.fileName = 'result.json';
    } else if (process.env.FORM_FACTOR === undefined && process.env.LOCALE === undefined) {
      this.fileName = `/result-${process.env.THEME}.json`;
    } else if (process.env.FORM_FACTOR === undefined && process.env.THEME === undefined) {
      this.fileName = `/result-${process.env.LOCALE}.json`;
    } else if (process.env.THEME === undefined && process.env.LOCALE === undefined) {
      this.fileName = `/result-${process.env.FORM_FACTOR}.json`;
    } else if (process.env.LOCALE === undefined) {
      this.fileName = `/result-${process.env.FORM_FACTOR}-${process.env.THEME}.json`;
    } else if (process.env.THEME === undefined) {
      this.fileName = `/result-${process.env.LOCALE}-${process.env.FORM_FACTOR}.json`;
    } else if (process.env.FORM_FACTOR === undefined) {
      this.fileName = `/result-${process.env.LOCALE}-${process.env.THEME}.json`;
    } else if (process.env.THEME !== undefined && process.env.LOCALE !== undefined && process.env.LOCALE !== undefined) {
      this.fileName = `/result-${process.env.LOCALE || '-'}${process.env.THEME || '-'}${process.env.FORM_FACTOR}.json`;
    }
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
          this.resultJsonObject.output.push(readableMessage.split(/\n/g));
        }
      });
    }
    this.fileNameCheck();
    fs.writeFileSync(`${this.filePath}${this.fileName}`, `${JSON.stringify(this.resultJsonObject, null, 2)}`, { flag: 'a+' }, (err) => {
      if (err) {
        Logger.error(err.message, { context: LOG_CONTEXT });
      }
    });
    this.resultJsonObject = {};
  }
}

module.exports = WdioCustomeReporter;
