import { validateHTML } from '../htmlVerifier';

jest.unmock('../htmlVerifier');

const tests = {
  firstTag: 'foo <a> foo',
  lastTag: 'foo </div> foo',
  control: '<div> foo </div>',
  doubleSpace: 'foo  bar',
  doubleSpaceWithNonBreakingSpace: 'foo \u00a0bar',
  doubleSpaceWithHtmlTag: 'foo <foo> bar</foo>',
  doubleSpaceWithHtmlTagClosing: '<foo>foo </foo> bar',
  selfClosing: 'foo <bar/> foo',
  openingWithAttr: 'foo <bar attr="barz"> foo',
};

describe('validateHTML', () => {
  it('should detect html errors', () => {
    expect(validateHTML(tests, 'test', true)).toMatchSnapshot();
  });

  it('should validate anchor with static href value', () => {
    expect(validateHTML({ validAnchor: '<a href="http://localhost">foo</a>' }, 'test', true)).toMatchSnapshot();
  });

  it('should validate anchor with interpolated href value', () => {
    expect(
      validateHTML({ validAnchor: '<a href="%(googlePrivacyUrl)s">Règles de confidentialité</a>' }, 'test', true),
    ).toMatchSnapshot();
  });
});
