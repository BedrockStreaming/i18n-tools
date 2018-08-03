import React from 'react';
import PropTypes from 'prop-types';

export const HtmlTrans = ({ i18nKey, data, number, general, element, ...otherProps }, { getTranslateFunction }) => {
  const t = getTranslateFunction();
  const props = { ...otherProps, dangerouslySetInnerHTML: { __html: t(i18nKey, data, number, general) } };

  return React.createElement(element, props);
};

HtmlTrans.defaultProps = {
  element: 'span',
  data: {},
  number: undefined,
  general: false,
};

HtmlTrans.propTypes = {
  element: PropTypes.string,
  i18nKey: PropTypes.string.isRequired,
  data: PropTypes.object,
  number: PropTypes.number,
  general: PropTypes.bool,
};

HtmlTrans.contextTypes = {
  getTranslateFunction: PropTypes.func.isRequired,
};
