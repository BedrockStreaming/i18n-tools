import { useContext } from 'react';
import { Context } from '../context/i18n.context';

export const useTranslate = () => {
  const t = useContext(Context);

  return (key, { data, general, renderers } = {}) => t(key, data, general, renderers);
};
