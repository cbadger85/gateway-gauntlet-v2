import React, { ReactElement } from 'react';
import { shallow } from 'enzyme';
import TournamentMissionCard from '../../components/TournamentMissionCard';
import ListItemText from '@material-ui/core/ListItemText';
import TournamentInfoToggleCard from '../../components/TournamentInfoToggleCard';
import EditMissionsDrawer from '../../components/EditMissionsDrawer';

jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockReturnValue(['mission 1', 'mission 2']),
}));

jest.mock('../../store');

describe('<TournamentMissionCard />', () => {
  it('should show a list of missions', () => {
    const wrapper = shallow(<TournamentMissionCard />);
    const renderProp = shallow(
      wrapper
        .find(TournamentInfoToggleCard)
        .props()
        .children(true, jest.fn()) as ReactElement,
    );

    const listItemText = renderProp.find(ListItemText);

    expect(listItemText).toHaveLength(2);
  });

  it('should open the drawer when onEdit is called', () => {
    const wrapper = shallow(<TournamentMissionCard />);

    wrapper.find(TournamentInfoToggleCard).invoke('onEdit')?.();

    const isOpen = wrapper.find(EditMissionsDrawer).props().isOpen;

    expect(isOpen).toBeTruthy();
  });

  it('should close the drawer when closeDrawer is called', () => {
    const wrapper = shallow(<TournamentMissionCard />);

    wrapper.find(TournamentInfoToggleCard).invoke('onEdit')?.();

    wrapper.find(EditMissionsDrawer).invoke('closeDrawer')();

    const isOpen = wrapper.find(EditMissionsDrawer).props().isOpen;

    expect(isOpen).toBeFalsy();
  });
});
