import { flatten } from '../src/utils';

jest.unmock('../src/utils');

describe('flatten', () => {
  it('should flatten a lang object', () => {
    const lang = {
      foo: {
        foo: {
          foo: 'bar',
          foobar: 'foo foo',
        },
      },
      bar: 'foo foo foo',
    };

    const res = flatten(lang);
    expect(res).toEqual({ bar: 'foo foo foo', 'foo.foo.foo': 'bar', 'foo.foo.foobar': 'foo foo' });
  });
});
