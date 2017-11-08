import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';
import Trans from '../i18n.component';


describe('i18n.renderProps', () => {
  let context;
  let listeners;
  const childContextTypes = {
    getTranslateFunction: PropTypes.func,
    subscribe: PropTypes.func,
    unsubscribe: PropTypes.func,
  };

  beforeEach(() => {
    listeners = [];
    context = {
      getTranslateFunction: jest.fn(() => jest.fn(x => x)),
      subscribe: jest.fn(listener => listeners.push(listener)),
      unsubscribe: jest.fn(),
    };
  });

  it('should provide translate function and inherited props', () => {
    const wrapper = shallow(<Trans i18nKey="foo.bar" />, { context, childContextTypes });

    expect(wrapper).toMatchSnapshot();
  });

  it('should subscribe to provider for lang update', () => {
    shallow(<Trans i18nKey="foo.bar" />, { context, childContextTypes })

    expect(context.subscribe).toBeCalledWith(jasmine.any(Function));
  });

  it('should unsubscribe from provider when unmounted', () => {
    const wrapper = shallow(<Trans i18nKey="foo.bar" />, { context, childContextTypes });

    wrapper.unmount();
    expect(context.unsubscribe).toBeCalledWith(jasmine.any(Function));
  });

  it('should rerender on update', () => {
    const firstTranslationFunction = jest.fn(x => x);
    const secondTranslationFunction = jest.fn(x => `**${x}**`);
    context.getTranslateFunction = jest.fn(() => firstTranslationFunction);

    const wrapper = shallow(<Trans i18nKey="foo.bar" />, { context, childContextTypes });

    expect(wrapper).toMatchSnapshot();

    context.getTranslateFunction.mockImplementation(() => secondTranslationFunction);
    expect(listeners.length).toBe(1);

    wrapper.setContext(context);
    listeners[0]();

    expect(wrapper).toMatchSnapshot();
  });
});
