import React from 'react';
import { User, Role } from '../../types/User';
import { getOrganizers } from '../../controllers/organizersController';
import { postGame } from '../../controllers/gamesController';
import { addSnackbar } from '../../store/alert/alertSlice';
import AddTournamentForm, {
  AddTournamentFieldData,
} from '../../components/AddTournamentForm';
import { mount, shallow } from 'enzyme';
import AddTournamentDrawer from '../../components/AddTournamentDrawer';
import { Game } from '../../types/Game';
import { act } from 'react-dom/test-utils';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('../../controllers/organizersController', () => ({
  getOrganizers: jest.fn(),
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
  (getOrganizers as jest.Mock).mockResolvedValue([organizer]);
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

    expect(getOrganizers).toBeCalledWith();
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
