import { useContext } from 'react';
import { Context } from '../../context/i18n.context';
import { useTranslate } from '../useTranslate';

jest.mock('react');

const t = jest.fn();
useContext.mockReturnValue(t);

describe('useTranslate', () => {
  it('should wrap the translation function', () => {
    const wrapTranslate = useTranslate();
    wrapTranslate('key', { data: {}, number: 'number', general: 'general', renderers: 'renderers' });

    expect(useContext).toHaveBeenCalledWith(Context);
    expect(t).toHaveBeenCalledWith('key', {}, 'number', 'general', 'renderers');
  });
});
