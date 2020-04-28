import fs from 'fs';
import WdioReporter from '../../src/wdio/WdioFileReporter';

jest.mock('fs');
jest.mock('path');
let fsWriteSpy;
let spygetSuiteResult;
describe('Wdio File Reporter Testing', () => {
  afterEach(() => {
    fsWriteSpy.mockClear();
    spygetSuiteResult.mockClear();
  });
  beforeEach(() => {
    fsWriteSpy = jest.spyOn(fs, 'writeFileSync');
    spygetSuiteResult = jest.fn().mockImplementation(() => 'test result');
  });

  it('Result Json object is appended to the file', () => {
    const wdioReporter = new WdioReporter({});
    wdioReporter.runners = [
      {
        event: 'runner:end',
        failures: 0,
        cid: '0-2',
        specs: ['/opt/module/tests/wdio/hideInputCaret-spec.js'],
        specHash: 'f75728c9953420794e669cae74b03d58',
      },
    ];
    wdioReporter.baseReporter = {
      stats: {
        start: 'Tue Apr 28 2020 12:14:56',
        end: 'Tue Apr 28 2020 12:14:59',
      },
    };
    wdioReporter.getSuiteResult = spygetSuiteResult;
    wdioReporter.printSuitesSummary();
    expect(fsWriteSpy).toBeCalled();
  });
});
