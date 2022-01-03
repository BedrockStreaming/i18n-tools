import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { translate } from '../utils/i18n.utils';
import { Context } from '../context/i18n.context';

export const I18nProvider = ({ lang, i18nNames, children, errorCallback, parseHTML }) => {
  const t = useMemo(() => translate(lang, { i18nNames, errorCallback, parseHTML }), [
    lang,
    i18nNames,
    errorCallback,
    parseHTML,
  ]);

  return <Context.Provider value={t}>{children}</Context.Provider>;
};

I18nProvider.propTypes = {
  children: PropTypes.element.isRequired,
  lang: PropTypes.object.isRequired,
  parseHTML: PropTypes.bool,
  i18nNames: PropTypes.object,
  errorCallback: PropTypes.func,
};
