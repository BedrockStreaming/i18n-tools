import React from 'react';
import PropTypes from 'prop-types';
import { Context } from './../context/i18n.context';

export const Trans = ({ i18nKey, data, number, general, renderers }) => (
  <Context.Consumer>{t => t(i18nKey, { data, number, general, renderers })}</Context.Consumer>
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
  renderers: PropTypes.object,
};
