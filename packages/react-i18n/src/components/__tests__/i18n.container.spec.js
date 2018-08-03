import React from 'react';
import { shallow } from 'enzyme';
import { translate } from '../i18n.container';

jest.mock('../i18n.context');

describe('i18n container', () => {
  const DummyComponent = props => <div {...props} />;
  const TranslatedComponent = translate(DummyComponent);

  it('should provide translate function and inherited props', () => {
    const wrapper = shallow(<TranslatedComponent foo="bar" />);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
