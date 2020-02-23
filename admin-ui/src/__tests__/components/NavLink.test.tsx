import { shallow } from 'enzyme';
import React from 'react';
import NavLink from '../../components/NavLink';

describe('<NavLink />', () => {
  it('should show the active indicator if the link is active', () => {
    const wrapper = shallow(
      <NavLink to="/" isActive>
        test
      </NavLink>,
    );

    const activeIndicator = wrapper.find('[data-testid="active-indicator"]');

    expect(activeIndicator.exists()).toBeTruthy();
  });

  it('should not show the active indicator if the link is not active', () => {
    const wrapper = shallow(<NavLink to="/">test</NavLink>);

    const activeIndicator = wrapper.find('[data-testid="active-indicator"]');

    expect(activeIndicator.exists()).toBeFalsy();
  });
});
