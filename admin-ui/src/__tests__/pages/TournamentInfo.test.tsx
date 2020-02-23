import React from 'react';
import { shallow } from 'enzyme';
import TournamentInfo from '../../pages/TournamentInfo';

jest.mock('../../store');

describe('<TournamentInfo />', () => {
  it('should shallow render without crashing', () => {
    const wrapper = shallow(<TournamentInfo />);

    expect(wrapper.exists()).toBeTruthy();
  });
});
