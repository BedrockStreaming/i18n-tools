import { Trans, translate, I18nProvider, translateFunction, useTranslate } from '../';

describe('index', () => {
  it('should export translate function', () => {
    expect(typeof translate).toBe('function');
    expect(typeof Trans).toBe('function');
    expect(typeof I18nProvider).toBe('function');
    expect(typeof translateFunction).toBe('function');
    expect(typeof useTranslate).toBe('function');
  });
});
