import { useContext } from 'react';
import { Context } from '../context/i18n.context';

export const useT = () => useContext(Context);
