import React from 'react';
import PropTypes from 'prop-types';
import { translate } from '../utils/i18n.utils';
import { Provider } from './i18n.context';

export const I18nProvider = ({ lang, i18nNames, children }) => (
  <Provider value={translate(lang, i18nNames)}>{children}</Provider>
);

I18nProvider.propTypes = {
  children: PropTypes.element.isRequired,
  lang: PropTypes.object.isRequired,
  i18nNames: PropTypes.object,
};
