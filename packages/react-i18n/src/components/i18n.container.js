import React from 'react';
import PropTypes from 'prop-types';
import { ReactI18n } from './i18n.context';


export const translate = RenderComponent => {
  const TranslatedComponent = props => {
    if (props.componentRef) {
      return (
        <ReactI18n.consumer>
          {t => <RenderComponent t={t} {...props} ref={element => props.componentRef(element)} />}
        </ReactI18n.consumer>
      );
    }

    return <ReactI18n.consumer>{t => <RenderComponent t={t} {...props} />}</ReactI18n.consumer>;
  };

  TranslatedComponent.propTypes = {
    componentRef: PropTypes.func,
  };

  TranslatedComponent.fetchData = RenderComponent.fetchData;
  TranslatedComponent.displayName = `Translated(${RenderComponent.displayName || RenderComponent.name})`;

  return TranslatedComponent;
};
