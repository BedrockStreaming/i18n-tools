import { useContext } from 'react';
import { Context } from '../context/i18n.context';

export const useTranslate = () => {
  const t = useContext(Context);

  return (key, { data, number, general, renderers } = {}) => t(key, data, number, general, renderers);
};
