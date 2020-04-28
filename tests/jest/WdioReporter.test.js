import fs from 'fs';
import WdioReporter from '../../src/wdio/WdioFileReporter';

jest.mock('fs');
jest.mock('path');
let fsAppendSpy;
describe('Wdio File Reporter Testing', () => {
  afterEach(() => {
    fsAppendSpy.mockClear();
  });
  beforeEach(() => {
    fsAppendSpy = jest.spyOn(fs, 'appendFile');
  });

  it('Result Json object is appended to the file', () => {
    const wdioReporter = new WdioReporter({});
    wdioReporter.onRunComplete([], 'exactly');
    expect(fsAppendSpy).toBeCalled();
  });
});
