import React from 'react';
import { shallow } from 'enzyme';
import { Trans } from '../i18nString.component';

jest.mock('../../context/i18n.context');

describe('i18n.renderProps', () => {

  it('should return a translated string', () => {
    const wrapper = shallow(<Trans i18nKey="foo.bar" />);

    expect(wrapper.dive()).toMatchSnapshot();
  });
});
