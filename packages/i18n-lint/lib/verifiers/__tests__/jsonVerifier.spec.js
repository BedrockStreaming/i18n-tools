'use strict';

var _jsonVerifier = require('../jsonVerifier');

jest.unmock('../jsonVerifier');

describe('jsonVerifier', function () {
  it('should detect that two same level keys (first range) are not sorted', function () {
    var invalidJson = {
      b: 'bad position',
      a: {
        z: 'bad',
        c: 'position'
      }
    };
    expect((0, _jsonVerifier.validateJson)(invalidJson, 'en')).toEqual([{ error: true, message: 'current key b is bigger than its next key a' }, { error: true, message: 'current key z is bigger than its next key c' }]);
  });
});