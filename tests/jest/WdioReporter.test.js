import fs from 'fs';
import WdioReporter from '../../src/wdio/WdioFileReporter';

jest.mock('fs');
jest.mock('path');

describe('Wdio File Reporter Testing', () => {
  let fsWriteSpy;
  let spyGetSuiteResult;
  const wdioReporter = new WdioReporter({});
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

  it('should not call fs.writeFileSync when no test cases', () => {
    wdioReporter.runners = [];
    wdioReporter.baseReporter = {
      stats: {
        start: 'Tue Apr 28 2020 12:14:56',
        end: 'Tue Apr 28 2020 12:14:59',
      },
    };
    wdioReporter.printSuitesSummary();
    expect(fsWriteSpy).not.toBeCalled();
  });

  it('should call fs.writeFileSync when have some test cases', () => {
    wdioReporter.runners = [runner];
    wdioReporter.baseReporter = {
      stats: {
        start: 'Tue Apr 28 2020 12:14:56',
        end: 'Tue Apr 28 2020 12:14:59',
      },
    };
    wdioReporter.getSuiteResult = spyGetSuiteResult;
    wdioReporter.printSuitesSummary();
    expect(fsWriteSpy).toBeCalled();
  });
});
