import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import context from './i18n.context';

export const translate = RenderComponent => {
  const TranslatedComponent = props => {
    const t = useContext(context);

    if (props.componentRef) {
      return <RenderComponent t={t} {...props} ref={element => props.componentRef(element)} />;
    }

    return <RenderComponent t={t} {...props} />;
  };

  TranslatedComponent.propTypes = {
    componentRef: PropTypes.func,
  };

  TranslatedComponent.fetchData = RenderComponent.fetchData;
  TranslatedComponent.displayName = `Translated(${RenderComponent.displayName || RenderComponent.name})`;

  return TranslatedComponent;
};
