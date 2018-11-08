import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import context from './i18n.context';

export const HtmlTrans = ({ i18nKey, data, number, general, element: Element, ...props }) => {
  const t = useContext(context);

  return <Element {...props} dangerouslySetInnerHTML={{ __html: t(i18nKey, data, number, general) }}/>;
};

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
