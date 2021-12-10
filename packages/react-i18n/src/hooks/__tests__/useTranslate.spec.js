import { useContext } from 'react';
import { Context } from '../../context/i18n.context';
import { useTranslate } from '../useTranslate';

jest.mock('react');

const t = jest.fn();
useContext.mockReturnValue(t);

describe('useTranslate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should wrap the translation function', () => {
    const wrapTranslate = useTranslate();
    wrapTranslate('key', { data: {}, general: 'general', renderers: 'renderers' });

    expect(useContext).toHaveBeenCalledWith(Context);
    expect(t).toHaveBeenCalledWith('key', {}, 'general', 'renderers');
  });

  it('should wrap the translation function 2', () => {
    const wrapTranslate = useTranslate();
    wrapTranslate('key');

    expect(useContext).toHaveBeenCalledWith(Context);
    expect(t).toHaveBeenCalledWith('key', undefined, undefined, undefined);
  });
});
