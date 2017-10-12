import { translate } from '../i18n.utils';

describe('i18n provider', () => {
  it('should return the key if the translation is missing', () => {
    expect(translate()('foo.bar')).toBe('foo.bar');
    expect(translate({})('foo.bar')).toBe('foo.bar');
  });

  it('should return translation for a given key ', () => {
    const lang = { foo: { bar: 'foo bar!' } };
    expect(translate(lang)('foo.bar')).toBe('foo bar!');
  });

  it('should interpolate', () => {
    const lang = { foo: { bar: 'Hello %(name)s !' } };
    const t = translate(lang);
    expect(t('foo.bar', { name: 'World' })).toBe('Hello World !');
  });

  it('should pluralize', () => {
    const lang = { foo: { bar: { one: 'foo bar!', other: 'foos bars!!!' } } };
    const t = translate(lang);
    expect(t('foo.bar', undefined, 0)).toBe('foo bar!');
    expect(t('foo.bar', undefined, 1)).toBe('foo bar!');
    expect(t('foo.bar', undefined, 2)).toBe('foos bars!!!');
  });
});
