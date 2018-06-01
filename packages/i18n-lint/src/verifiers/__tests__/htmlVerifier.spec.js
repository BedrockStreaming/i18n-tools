import HtmlVerifier from '../htmlVerifier';

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

describe('htmlVerifier', () => {
  it('should detect html errors', () => {
    expect(HtmlVerifier(tests, 'test', true)).toMatchSnapshot();
  });
});
