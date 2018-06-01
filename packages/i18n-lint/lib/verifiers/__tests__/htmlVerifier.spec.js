'use strict';

var _htmlVerifier = require('../htmlVerifier');

var _htmlVerifier2 = _interopRequireDefault(_htmlVerifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.unmock('../htmlVerifier');

var tests = {
  firstTag: 'foo <div> foo',
  lastTag: 'foo </div> foo',
  control: '<div> foo </div>',
  doubleSpace: 'foo  bar',
  doubleSpaceWithNonBreakingSpace: 'foo \xA0bar',
  doubleSpaceWithHtmlTag: 'foo <foo> bar</foo>',
  doubleSpaceWithHtmlTagClosing: '<foo>foo </foo> bar'
};

describe('htmlVerifier', function () {
  it('should detect html errors', function () {
    expect((0, _htmlVerifier2.default)(tests, 'test', true)).toMatchSnapshot();
  });
});