import React from 'react';
import PropTypes from 'prop-types';
import { Consumer } from './i18n.context';

export const HtmlTrans = ({ i18nKey, data, number, general, element: Element, ...props }) => (
  <Consumer>
    {t => <Element {...props} dangerouslySetInnerHTML={{ __html: t(i18nKey, data, number, general) }} />}
  </Consumer>
);

HtmlTrans.defaultProps = {
  element: 'span',
  data: {},
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
