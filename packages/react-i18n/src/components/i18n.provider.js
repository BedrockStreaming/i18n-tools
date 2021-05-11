import React from 'react';
import PropTypes from 'prop-types';
import { translate } from '../utils/i18n.utils';
import { Context } from '../context/i18n.context';

export const I18nProvider = ({ lang, i18nNames, children, errorCallback, parseHTML }) => (
  <Context.Provider value={translate(lang, i18nNames, errorCallback, parseHTML)}>{children}</Context.Provider>
);

I18nProvider.propTypes = {
  children: PropTypes.element.isRequired,
  lang: PropTypes.object.isRequired,
  parseHTML: PropTypes.bool,
  i18nNames: PropTypes.object,
  errorCallback: PropTypes.func,
};
