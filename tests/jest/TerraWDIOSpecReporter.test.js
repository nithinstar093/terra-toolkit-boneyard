import fs from 'fs';
import WdioReporter from '../../src/wdio/reporters/TerraWDIOSpecReporter';

jest.mock('fs');

describe('Wdio File Reporter Testing', () => {
  let fsWriteSpy;
  let spyGetSuiteResult;
  const wdioReporter = new WdioReporter({}, { reporterDir: 'wdio/reports' });
  const runner = {
    event: 'runner:end',
    failures: 0,
    cid: '0-2',
    specs: ['/opt/module/tests/wdio/hideInputCaret-spec.js'],
    specHash: 'f75728c9953420794e669cae74b03d58',
  };
  afterEach(() => {
    fsWriteSpy.mockClear();
    spyGetSuiteResult.mockClear();
  });
  beforeEach(() => {
    fsWriteSpy = jest.spyOn(fs, 'writeFileSync');
    spyGetSuiteResult = jest.fn().mockImplementation(() => 'test result');
  });
  it('resultJsonObject should have output, startDate, endDate, and type', () => {
    expect(wdioReporter.resultJsonObject).toHaveProperty('output');
    expect(wdioReporter.resultJsonObject).toHaveProperty('startDate');
    expect(wdioReporter.resultJsonObject).toHaveProperty('endDate');
    expect(wdioReporter.resultJsonObject).toHaveProperty('type');
    expect(typeof wdioReporter.resultJsonObject.output).toEqual('object');
  });

  it('should have output property in the resultJsonObject and have some length while calling printSuitesSummary ', () => {
    wdioReporter.runners = [runner];
    wdioReporter.baseReporter = {
      stats: {
        start: 'Tue Apr 28 2020 12:14:56',
        end: 'Tue Apr 28 2020 12:14:59',
      },
    };
    wdioReporter.resultJsonObject.output = ['result'];
    expect(wdioReporter.resultJsonObject.output.length).toBeGreaterThanOrEqual(1);
    wdioReporter.getSuiteResult = spyGetSuiteResult;
    wdioReporter.printSuitesSummary();
    expect(fsWriteSpy).toBeCalled();
  });

  it('should set filePath when  options.filePath not available', () => {
    expect(wdioReporter.filePath).toEqual(expect.stringContaining('wdio/reports'));
  });
});
