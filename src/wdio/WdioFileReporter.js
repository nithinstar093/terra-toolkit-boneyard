/* eslint-disable prefer-rest-params */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable class-methods-use-this */
const WDIOSpecReporter = require('wdio-spec-reporter/build/reporter');
const jsonMultilineStrings = require('json-multiline-strings');
const stripAnsi = require('strip-ansi');
const fs = require('fs');
const path = require('path');

const jsonFilePath = path.resolve(__dirname, './result.json');

class WdioCustomeReporter extends WDIOSpecReporter {
  constructor(globalConfig, options) {
    super(globalConfig);
    this.isSpecStarted = false;
    this.options = options;
    this.getSuiteCustomResult = this.getSuiteCustomResult.bind(this);
    this.runners = [];
    this.on('runner:end', (runner) => {
      console.log('runner inside cons', runner);
      this.runners.push(runner);
    });
  }

  getSuiteCustomResult(runner) {
    const { cid } = runner;
    const { stats } = this.baseReporter;

    const results = stats.runners[cid];
    const preface = `[${this.getBrowserCombo(results.capabilities, false)} #${cid}]`;
    const specHash = stats.getSpecHash(runner);
    const spec = results.specs[specHash];
    const combo = this.getBrowserCombo(results.capabilities);
    const failures = stats.getFailures().filter((f) => f.cid === cid || Object.keys(f.runner).indexOf(cid) > -1);

    /**
     * don't print anything if no specs where executed
     */
    if (Object.keys(spec.suites).length === 0) {
      return '';
    }

    this.errorCount = 0;
    let output = '';

    output += '------------------------------------------------------------------\n';

    /**
     * won't be available when running multiremote tests
     */
    if (results.sessionID) {
      output += `${preface} Session ID: ${results.sessionID}\n`;
    }

    output += `${preface} Spec: ${this.specs[cid]}\n`;

    /**
     * won't be available when running multiremote tests
     */
    if (combo) {
      output += `${preface} Running: ${combo}\n`;
    }

    output += `${preface}\n`;
    output += this.getResultList(cid, spec.suites, preface);
    output += `${preface}\n`;
    // eslint-disable-next-line no-underscore-dangle
    output += this.getSummary(this.results[cid], spec._duration, preface);
    output += this.getFailureList(failures, preface);
    output += this.getJobLink(results, preface);
    output += `${preface}\n`;
    return output;
  }

  printSuitesSummary() {
    const resultData = {
      result: [],
    };
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
          result: stripAnsi(this.getSuiteCustomResult(runner)),
          endDate,
        };
        resultData.result.push(jsonObject);
      });
      fs.appendFileSync(jsonFilePath, `${JSON.stringify(jsonMultilineStrings.split(resultData), null, 2)}\n\n`, (err) => {
        if (err) {
          console.log(`File Error -> ${err.message}`);
        }
      });
    }
  }
}

module.exports = WdioCustomeReporter;
