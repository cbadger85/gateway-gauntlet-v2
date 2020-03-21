import Button from '@material-ui/core/Button';
import { mount, ReactWrapper, shallow } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import AddTournamentDrawer from '../../components/AddTournamentDrawer';
import TournamentTable from '../../components/TournamentTable';
import { getGames } from '../../controllers/gamesController';
import { useHasRole } from '../../hooks/useHasRole';
import Tournaments from '../../pages/Tournaments';
import { Game, GameStatus } from '../../types/Game';
import { Role, User } from '../../types/User';
import { MemoryRouter as Router } from 'react-router-dom';

jest.mock('../../store');

jest.mock('react-redux', () => ({
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
  useSelector: jest.fn().mockReturnValue([]),
}));

jest.mock('../../controllers/gamesController', () => ({
  getGames: jest.fn(),
}));

jest.mock('../../hooks/useHasRole', () => ({
  useHasRole: jest.fn(),
}));

const user1: User = {
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
  organizers: [user1],
  players: [],
  length: 1,
  status: GameStatus.NEW,
  price: 1000,
};

beforeEach(jest.clearAllMocks);

beforeAll(() => {
  (getGames as jest.Mock).mockResolvedValue([tournament]);
});

describe('<Tournaments />', () => {
  it('should show the Add Tournament button if the user is an organizer', () => {
    (useHasRole as jest.Mock).mockReturnValue(() => true);
    const wrapper = shallow(<Tournaments />);

    const addButton = wrapper.find(Button);

    expect(addButton.exists()).toBeTruthy();
  });

  it('should hide the Add User button if the user is not an admin', () => {
    (useHasRole as jest.Mock).mockReturnValue(() => false);
    const wrapper = shallow(<Tournaments />);

    const addButton = wrapper.find(Button);

    expect(addButton.exists()).toBeFalsy();
  });

  it('should get all tournaments on mount', async () => {
    (useHasRole as jest.Mock).mockReturnValue(() => true);

    let wrapper: ReactWrapper<any, Readonly<{}>>;

    await act(async () => {
      wrapper = mount(
        <Router>
          <Tournaments />
        </Router>,
      );
    });

    wrapper!.update();
    const { tournaments } = wrapper!.find(TournamentTable).props();

    expect(tournaments).toHaveLength(1);
  });

  it('should add a tournament when handleAddTournament is called', async () => {
    (useHasRole as jest.Mock).mockReturnValue(() => true);

    const wrapper = shallow(<Tournaments />);

    const handleAddTournament = wrapper
      .find(AddTournamentDrawer)
      .invoke('addTournament');

    const addedTournament: Game = {
      id: '5678',
      name: 'tournament 2',
      missions: ['mission 1'],
      date: new Date(Date.now()).toDateString(),
      organizers: [user1],
      players: [],
      length: 1,
      status: GameStatus.NEW,
      price: 1000,
    };

    handleAddTournament(addedTournament);

    const { tournaments } = wrapper.find(TournamentTable).props();

    expect(tournaments).toHaveLength(1);
  });

  it('should open the drawer when the Add Tournament button is clicked', async () => {
    (useHasRole as jest.Mock).mockReturnValue(() => true);

    const wrapper = shallow(<Tournaments />);

    const handleToggleDrawer = wrapper.find(Button).invoke('onClick');

    handleToggleDrawer?.({} as any);

    const isDrawerOpen = wrapper.find(AddTournamentDrawer).props().isOpen;

    expect(isDrawerOpen).toBeTruthy();
  });
});
