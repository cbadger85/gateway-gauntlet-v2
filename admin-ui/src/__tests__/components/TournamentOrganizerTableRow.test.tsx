import React from 'react';
import { shallow } from 'enzyme';
import TournamentOrganizerTableRow from '../../components/TournamentOrganizerTableRow';
import { Organizer } from '../../types/Game';
import IconButton from '@material-ui/core/IconButton';
import { removeOrganizer } from '../../store/tournament/tournamentSlice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockReturnValue({ tournamentId: '1234' }),
}));

jest.mock('../../store/tournament/tournamentSlice', () => ({
  removeOrganizer: jest.fn(),
}));

jest.mock('../../store');

describe('<TournamentOrganizerTableRow />', () => {
  it('should show the delete button if showDeleteButton is true', () => {
    const organizer: Organizer = {
      id: '1',
      name: 'foo',
      email: 'foo@example.com',
    };
    const wrapper = shallow(
      <TournamentOrganizerTableRow organizer={organizer} showDeleteButton />,
    );

    const deleteButton = wrapper.find(IconButton);

    expect(deleteButton.exists()).toBeTruthy();
  });

  it('should not show the delete button if showDeleteButton is falsy', () => {
    const organizer: Organizer = {
      id: '1',
      name: 'foo',
      email: 'foo@example.com',
    };
    const wrapper = shallow(
      <TournamentOrganizerTableRow organizer={organizer} />,
    );

    const deleteButton = wrapper.find(IconButton);

    expect(deleteButton.exists()).toBeFalsy();
  });

  it('should show the delete button if showDeleteButton is true', () => {
    const organizer: Organizer = {
      id: '1',
      name: 'foo',
      email: 'foo@example.com',
    };
    const wrapper = shallow(
      <TournamentOrganizerTableRow organizer={organizer} showDeleteButton />,
    );

    wrapper.find(IconButton).invoke('onClick')?.({} as any);

    expect(removeOrganizer).toBeCalledWith('1234', '1');
  });
});
