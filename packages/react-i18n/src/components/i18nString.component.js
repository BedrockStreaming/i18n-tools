import React from 'react';
import PropTypes from 'prop-types';
import { Consumer } from './i18n.context';

export const Trans = ({ i18nKey, data, number, general }) => (
  <Consumer>{t => t(i18nKey, data, number, general)}</Consumer>
);

Trans.defaultProps = {
  data: {},
  general: false,
};

Trans.propTypes = {
  i18nKey: PropTypes.string.isRequired,
  data: PropTypes.object,
  number: PropTypes.number,
  general: PropTypes.bool,
};

Trans.contextTypes = {
  getTranslateFunction: PropTypes.func.isRequired,
};
