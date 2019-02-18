import { useContext } from 'react';
import { Context } from '../../context/i18n.context';
import { useTranslate } from '../useTranslate';

jest.mock('react');

useContext.mockReturnValue('t function');

describe('useTranslate', () => {
  it('should return the translation function', () => {
    const t = useTranslate();

    expect(useContext).toHaveBeenCalledWith(Context);
    expect(t).toBe('t function');
  });
});
