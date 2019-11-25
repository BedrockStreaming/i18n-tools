import React from 'react';
import PropTypes from 'prop-types';
import { Context } from '../context/i18n.context';

export const HtmlTrans = ({ i18nKey, data, number, general, element: Element, renderers, ...props }) => (
  <Context.Consumer>
    {t => <Element {...props} dangerouslySetInnerHTML={{ __html: t(i18nKey, data, number, general, renderers) }} />}
  </Context.Consumer>
);

HtmlTrans.defaultProps = {
  element: 'span',
  data: {},
  general: false,
};

HtmlTrans.propTypes = {
  element: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.func]),
  i18nKey: PropTypes.string.isRequired,
  data: PropTypes.object,
  number: PropTypes.number,
  general: PropTypes.bool,
  renderers: PropTypes.object,
};
