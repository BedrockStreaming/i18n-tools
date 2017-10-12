import PropTypes from 'prop-types';
import { PureComponent, Children } from 'react';
import { translate } from '../utils/i18n.utils';

export class I18nProvider extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = { lang: props.lang };
    if (process.env.DEBUG_MODE) {
      this.listeners = [];
    }
  }

  getChildContext() {
    const context = {
      getTranslateFunction: () => translate(this.state.lang, this.props.i18nNames),
    };

    if (process.env.DEBUG_MODE) {
      context.updateLang = lang => this.setState({ lang });
      context.subscribe = listener => this.listeners.push(listener);
      context.unsubscribe = listener => {
        const index = this.listeners.indexOf(listener);

        if (index !== -1) {
          this.listeners = this.listeners.slice(index, 1);
        }
      };
    }

    return context;
  }

  componentDidUpdate() {
    if (process.env.DEBUG_MODE) {
      this.listeners.forEach(listener => listener());
    }
  }

  render() {
    return Children.only(this.props.children);
  }
}

I18nProvider.propTypes = {
  children: PropTypes.element.isRequired,
  lang: PropTypes.object.isRequired,
  i18nNames: PropTypes.object,
};

I18nProvider.childContextTypes = {
  getTranslateFunction: PropTypes.func,
};

if (process.env.DEBUG_MODE) {
  I18nProvider.childContextTypes.updateLang = PropTypes.func;
  I18nProvider.childContextTypes.subscribe = PropTypes.func.isRequired;
  I18nProvider.childContextTypes.unsubscribe = PropTypes.func.isRequired;
}
