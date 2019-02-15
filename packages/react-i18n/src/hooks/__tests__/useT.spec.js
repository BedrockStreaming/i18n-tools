import { useContext } from 'react';
import { Context } from '../../context/i18n.context';
import { useT } from '../useT';

jest.mock('react');

useContext.mockReturnValue('t function')


describe('useT', () => {
  it('should return the translation function', () => {
    const t = useT();

    expect(useContext).toHaveBeenCalledWith(Context);
    expect(t).toBe('t function');
  });
});
