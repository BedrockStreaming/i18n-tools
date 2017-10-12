import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import { translate } from '../i18n.container';

let context;
let listeners;
const DummyComponent = props => <div {...props} />;
const TranslatedComponent = translate(DummyComponent);

describe('i18n container in debug mode', () => {
  beforeEach(() => {
    listeners = [];
    context = {
      getTranslateFunction: jest.fn(() => jest.fn()),
      subscribe: jest.fn(listener => listeners.push(listener)),
      unsubscribe: jest.fn(),
    };
  });

  it('should provide translate function and inherited props', () => {
    const wrapper = shallow(<TranslatedComponent foo="bar" />, { context });

    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });

  it('should subscribe to provider for lang update', () => {
    shallow(<TranslatedComponent foo="bar" />, { context, lifecycleExperimental: true });

    expect(context.subscribe).toBeCalledWith(jasmine.any(Function));
  });

  it('should unsubscribe from provider when unmounted', () => {
    const wrapper = shallow(<TranslatedComponent foo="bar" />, { context, lifecycleExperimental: true });

    wrapper.unmount();
    expect(context.unsubscribe).toBeCalledWith(jasmine.any(Function));
  });

  it('should rerender on update', () => {
    const firstTranslationFunction = jest.fn();
    const secondTranslationFunction = jest.fn();
    context.getTranslateFunction = jest.fn(() => firstTranslationFunction);

    const wrapper = shallow(<TranslatedComponent foo="bar" />, { context, lifecycleExperimental: true });
    expect(wrapper.find(DummyComponent).prop('t')).toBe(firstTranslationFunction);

    context.getTranslateFunction.mockImplementation(() => secondTranslationFunction);
    expect(listeners.length).toBe(1);
    expect(wrapper.find(DummyComponent).prop('t')).not.toBe(secondTranslationFunction);
    listeners[0]();
    expect(wrapper.find(DummyComponent).prop('t')).toBe(secondTranslationFunction);
  });
});
