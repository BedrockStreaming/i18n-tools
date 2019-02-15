import React from 'react';
import PropTypes from 'prop-types';
import { Context } from '../context/i18n.context';

export const translate = RenderComponent => {
  const TranslatedComponent = props => (
    <Context.Consumer>
      {t => {
        if (props.componentRef) {
          return <RenderComponent t={t} {...props} ref={element => props.componentRef(element)} />;
        }

        return <RenderComponent t={t} {...props} />;
      }}
    </Context.Consumer>
  );

  TranslatedComponent.propTypes = {
    componentRef: PropTypes.func,
  };

  TranslatedComponent.fetchData = RenderComponent.fetchData;
  TranslatedComponent.displayName = `Translated(${RenderComponent.displayName || RenderComponent.name})`;

  return TranslatedComponent;
};
