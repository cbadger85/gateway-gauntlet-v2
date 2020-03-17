import { shallow } from 'enzyme';
import React from 'react';
import ToggleRegistrationCard from '../../components/ToggleRegistrationCard';

describe('<ToggleRegistrationCard />', () => {
  it('should mount', () => {
    const wrapper = shallow(<ToggleRegistrationCard />);

    expect(wrapper.exists()).toBeTruthy();
  });
});
