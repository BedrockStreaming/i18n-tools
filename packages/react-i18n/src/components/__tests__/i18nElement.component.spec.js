import React from 'react';
import { shallow } from 'enzyme';
import { HtmlTrans } from '../i18nElement.component';

jest.mock('../i18n.context', () => ({
  Consumer: jest.fn(({ children}) => children(x => `<div>${x}</div>`))
}));

describe('i18n.renderProps', () => {
  const getWrapper = props => shallow(<HtmlTrans i18nKey="foo.bar" {...props} />);

  it('should return html translation', () => {
    const wrapper = getWrapper();

    expect(wrapper.dive()).toMatchSnapshot();
  });

  it('should return html translation in a div', () => {
    const wrapper = getWrapper({ element: 'div' });

    expect(wrapper.shallow()).toMatchSnapshot();
  });

  it('should return html translation in a react element', () => {
    const Dummy = props => <dummy {...props} />;
    const wrapper = getWrapper({ element: Dummy });

    expect(wrapper.shallow()).toMatchSnapshot();
  });
});
