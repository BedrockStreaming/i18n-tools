import { validateHTML } from '../htmlVerifier';

jest.unmock('../htmlVerifier');

const tests = {
  firstTag: 'foo <div> foo',
  lastTag: 'foo </div> foo',
  control: '<div> foo </div>',
  doubleSpace: 'foo  bar',
  doubleSpaceWithNonBreakingSpace: 'foo \u00a0bar',
  doubleSpaceWithHtmlTag: 'foo <foo> bar</foo>',
  doubleSpaceWithHtmlTagClosing: '<foo>foo </foo> bar',
};

describe('validateHTML', () => {
  it('should detect html errors', () => {
    expect(validateHTML(tests, 'test', true)).toMatchSnapshot();
  });
});
