import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import context from './i18n.context';

export const Trans = ({ i18nKey, data, number, general }) => {
  const t = useContext(context)

  return t(i18nKey, data, number, general);
};

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
