import React from 'react';
import { shallow } from 'enzyme';
import { translate } from '../i18n.container';

jest.unmock('../i18n.container');

describe('i18n container', () => {
  let context;
  let listeners;
  const DummyComponent = props => <div {...props} />;
  const TranslatedComponent = translate(DummyComponent);

  beforeEach(() => {
    listeners = [];
    context = {
      getTranslateFunction: jest.fn(() => jest.fn()),
    };
  });

  it('should provide translate function and inherited props', () => {
    const wrapper = shallow(<TranslatedComponent foo="bar" />, { context });

    expect(wrapper).toMatchSnapshot();
  });
});
