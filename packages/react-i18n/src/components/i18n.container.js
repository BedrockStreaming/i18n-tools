import React from 'react';
import PropTypes from 'prop-types';

export const translate = RenderComponent => {
  const TranslatedComponent = (props, context) => {
    const t = context.getTranslateFunction();

    if (props.componentRef) {
      return <RenderComponent t={t} {...props} ref={element => props.componentRef(element)} />;
    }

    return <RenderComponent t={t} {...props} />;
  };

  TranslatedComponent.propTypes = {
    componentRef: PropTypes.func,
  };

  TranslatedComponent.contextTypes = {
    getTranslateFunction: PropTypes.func.isRequired,
  };

  TranslatedComponent.fetchData = RenderComponent.fetchData;
  TranslatedComponent.displayName = `Translated(${RenderComponent.displayName || RenderComponent.name})`;

  return TranslatedComponent;
};
