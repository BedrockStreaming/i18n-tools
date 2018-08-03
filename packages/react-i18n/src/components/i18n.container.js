import React from 'react';
import PropTypes from 'prop-types';
import { Consumer } from './i18n.context';

export const translate = RenderComponent => {
  const TranslatedComponent = props => (
    <Consumer>
      {t => {
        if (props.componentRef) {
          return <RenderComponent t={t} {...props} ref={element => props.componentRef(element)} />;
        }

        return <RenderComponent t={t} {...props} />;
      }}
    </Consumer>
  );

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
