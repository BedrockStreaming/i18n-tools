import { validateJson } from '../jsonVerifier';

jest.unmock('../jsonVerifier');

describe('jsonVerifier', () => {
  it('should detect that two same level keys (first range) are not sorted', () => {
    const invalidJson = {
      b: 'bad position',
      a: {
        z: 'bad',
        c: 'position',
      },
    };
    expect(validateJson(invalidJson, 'en')).toEqual([
      { error: true, message: 'current key b is bigger than its next key a' },
      { error: true, message: 'current key z is bigger than its next key c' },
    ]);
  });
});
