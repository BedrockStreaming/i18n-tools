import { useContext } from 'react';
import { Context } from '../context/i18n.context';

const emptyObject = {};
export const useTranslate = () => {
  const t = useContext(Context);

  return (key, data = emptyObject) => t(key, data);
};
