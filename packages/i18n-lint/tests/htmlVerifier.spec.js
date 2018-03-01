import HtmlVerifier from '../src/htmlVerifier';

jest.unmock('../src/htmlVerifier');

const tests = {
  firstTag: 'foo <div> foo',
  lastTag: 'foo </div> foo',
  control: '<div> foo </div>',
};

describe('htmlVerifier', () => {
  it('should detect html errors', () => {
    expect(HtmlVerifier({ tests }, true)).toMatchSnapshot();
  });
});
