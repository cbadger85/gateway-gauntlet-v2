import { mount, shallow } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { useSelector } from 'react-redux';
import AddTournamentDrawer from '../../components/AddTournamentDrawer';
import AddTournamentForm, {
  AddTournamentFieldData,
} from '../../components/AddTournamentForm';
import { postGame } from '../../controllers/gamesController';
import { addSnackbar } from '../../store/alert/alertSlice';
import { getOrganizerList } from '../../store/organizer/organizerSlice';
import { Game } from '../../types/Game';
import { Role, User } from '../../types/User';

jest.mock('../../store');

jest.mock('react-redux', () => ({
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
  useSelector: jest.fn(),
}));

jest.mock('../../store/organizer/organizerSlice', () => ({
  getOrganizerList: jest.fn(),
}));

jest.mock('../../controllers/gamesController', () => ({
  postGame: jest.fn(),
}));

jest.mock('../../store/alert/alertSlice', () => ({
  addSnackbar: jest.fn(),
}));

const organizer: User = {
  id: '1',
  firstName: 'foo',
  lastName: 'bar',
  name: 'foo bar',
  username: 'foobar',
  email: 'foo@example.com',
  gravatar: 'gravatar',
  sessionId: '123',
  roles: [Role.ORGANIZER],
};

const tournament: Game = {
  id: '1234',
  name: 'tournament 1',
  missions: ['mission 1'],
  date: new Date(Date.now()).toDateString(),
  organizers: [organizer],
  players: [],
  length: 1,
};

const addTournamentFieldData: AddTournamentFieldData = {
  name: 'tournament',
  missions: ['mission 1'],
  date: new Date(Date.now()),
  organizerIds: ['1'],
};

beforeAll(() => {
  (useSelector as jest.Mock).mockReturnValue([organizer]);
});

beforeEach(jest.clearAllMocks);

describe('<AddTournamentDrawer />', () => {
  it('should get a list of organizers', async () => {
    const closeDrawer = jest.fn();
    const addTournament = jest.fn();

    await act(async () => {
      mount(
        <AddTournamentDrawer
          isOpen
          closeDrawer={closeDrawer}
          addTournament={addTournament}
        />,
      );
    });

    expect(getOrganizerList).toBeCalledWith();
  });

  it('should call createTournament and call snackbar if successful', async () => {
    (postGame as jest.Mock).mockResolvedValue(tournament);

    const closeDrawer = jest.fn();
    const addTournament = jest.fn();
    const wrapper = shallow(
      <AddTournamentDrawer
        isOpen
        closeDrawer={closeDrawer}
        addTournament={addTournament}
      />,
    );

    const handleAddTournament = wrapper.find(AddTournamentForm).invoke('save');

    await handleAddTournament(addTournamentFieldData);

    expect(postGame).toBeCalledWith(addTournamentFieldData);
    expect(addTournament).toBeCalledWith(tournament);
    expect(closeDrawer).toBeCalledWith();
    expect(addSnackbar).toBeCalled();
  });

  it('should call createTournament and set an error message if unsuccessful', async () => {
    (postGame as jest.Mock).mockRejectedValue(new Error());

    const closeDrawer = jest.fn();
    const addTournament = jest.fn();
    const wrapper = shallow(
      <AddTournamentDrawer
        isOpen
        closeDrawer={closeDrawer}
        addTournament={addTournament}
      />,
    );

    const handleAddTournament = wrapper.find(AddTournamentForm).invoke('save');

    await handleAddTournament(addTournamentFieldData);

    const errorMessage = wrapper.find(AddTournamentForm).props().errorMessage;

    expect(errorMessage).toBeTruthy();
  });
});
