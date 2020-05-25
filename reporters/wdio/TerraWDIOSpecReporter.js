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
    this.fileName = '';
    this.moduleName = '';
    this.setResultsDir = this.setResultsDir.bind(this);
    this.hasReportDir = this.hasReportDir.bind(this);
    this.setTestModule = this.setTestModule.bind(this);
    this.getIsMonoRepo = this.getIsMonoRepo.bind(this);
    this.printSummary = this.printSummary.bind(this);
    this.setTestDirPath = this.setTestDirPath.bind(this);
    this.isMonoRepo = this.getIsMonoRepo();
    this.setTestDirPath();
    this.filePath = this.setResultsDir(options);
    this.hasReportDir();
    this.on('runner:end', (runner) => {
      this.runners.push(runner);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  setTestDirPath() {
    let testDir = 'tests';
    if (fs.existsSync(path.join(process.cwd(), 'test'))) {
      testDir = 'test';
    }
    return path.join(testDir, 'wdio', 'reports', 'results');
  }

  setResultsDir(options) {
    if (options.reporterOptions && options.reporterOptions.outputDir) {
      return options.reporterOptions.outputDir;
    }
    return path.join(process.cwd(), this.setTestDirPath());
  }

  hasReportDir() {
    if (!fs.existsSync(this.filePath)) {
      fs.mkdirSync(this.filePath, { recursive: true }, (err) => {
        if (err) {
          Logger.error(err.message, { context: LOG_CONTEXT });
        }
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getIsMonoRepo() {
    return fs.existsSync(path.join(process.cwd(), 'packages'));
  }

  /**
  * Formatting the filename based on LOCALE, THEME, FORM_FACTOR and locale
  * @return null
  */
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
      this.fileName = '/result';
    }
    if (fileNameConf.length >= 1) {
      this.fileName = `/result-${fileNameConf.join('-')}`;
    }
  }

  setTestModule(specsValue) {
    const index = specsValue.lastIndexOf('packages/');
    if (index > -1) {
      const testFilePath = specsValue.substring(index).split('/');
      const moduleName = testFilePath && testFilePath[1] ? testFilePath[1] : '';
      if (moduleName && moduleName !== this.moduleName) {
        this.moduleName = moduleName;
      }
    }
  }

  printSummary(runners) {
    if (runners && runners.length) {
      runners.forEach((runner) => {
        this.setTestModule(runner.specs[0]);
        if (!this.resultJsonObject.output[this.moduleName]) {
          this.resultJsonObject.output[this.moduleName] = [];
        }
        const readableMessage = `${stripAnsi(this.getSuiteResult(runner))}${endOfLine}`;
        if (readableMessage.search('\n') !== -1) {
          this.resultJsonObject.output[this.moduleName].push(readableMessage.split(/\n/g));
        }
      });
    }
    this.fileNameCheck();
    const {
      endDate,
      startDate,
      locale,
      formFactor,
      theme,
      output,
    } = this.resultJsonObject;
    let filePathLocation = '';
    const moduleKeys = Object.keys(output) || [];
    if (output && moduleKeys.length) {
      moduleKeys.forEach(key => {
        const fileData = {
          startDate,
          locale,
          theme,
          formFactor,
          output: output[key],
          endDate,
        };
        if (this.isMonoRepo) {
          filePathLocation = `${this.filePath}${this.fileName}-${key}.json`;
        } else {
          filePathLocation = `${this.filePath}${this.fileName}.json`;
        }
        fs.writeFileSync(filePathLocation, `${JSON.stringify(fileData, null, 2)}`, { flag: 'w+' }, (err) => {
          if (err) {
            Logger.error(err.message, { context: LOG_CONTEXT });
          }
        });
      });
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
    this.printSummary(runners);
  }
}

module.exports = TerraWDIOSpecReporter;
