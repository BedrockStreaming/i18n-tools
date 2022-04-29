import { useContext } from 'react';
import { Context } from '../context/i18n.context';

export const useTranslate = () => {
  console.log('-----test-------');

  return useContext(Context);
};
