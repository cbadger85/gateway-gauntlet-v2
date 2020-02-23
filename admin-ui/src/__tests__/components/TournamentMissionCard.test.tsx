import React from 'react';
import { shallow } from 'enzyme';
import TournamentMissionCard from '../../components/TournamentMissionCard';
import ListItemText from '@material-ui/core/ListItemText';

jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockReturnValue(['mission 1', 'mission 2']),
}));

jest.mock('../../store');

describe('<TournamentMissionCard />', () => {
  it('should show a list of missions', () => {
    const wrapper = shallow(<TournamentMissionCard />);
    const renderProp = shallow(wrapper.props().children());

    const listItemText = renderProp.find(ListItemText);

    expect(listItemText).toHaveLength(2);
  });
});
