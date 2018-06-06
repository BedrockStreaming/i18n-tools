'use strict';

var _htmlVerifier = require('../htmlVerifier');

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

describe('validateHTML', function () {
  it('should detect html errors', function () {
    expect((0, _htmlVerifier.validateHTML)(tests, 'test', true)).toMatchSnapshot();
  });
});