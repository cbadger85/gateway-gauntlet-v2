import React from 'react';
import { useSelector } from 'react-redux';
import { Organizer } from '../../types/Game';
import { shallow, ReactWrapper, mount } from 'enzyme';
import AddOrganizerSelect from '../../components/AddOrganizerSelect';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { addOrganizer } from '../../store/tournament/tournamentSlice';
import { act } from 'react-dom/test-utils';
import { getOrganizerList } from '../../store/organizer/organizerSlice';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockReturnValue({ tournamentId: '1234' }),
}));

jest.mock('../../store/tournament/tournamentSlice', () => ({
  addOrganizer: jest.fn(),
}));

jest.mock('../../store/organizer/organizerSlice', () => ({
  getOrganizerList: jest.fn(),
}));

jest.mock('../../store');

beforeEach(jest.clearAllMocks);

describe('<AddOrganizerSelect />', () => {
  it('should display a list of filtered organizers', () => {
    const organizers: Organizer[] = [
      {
        id: '1',
        name: 'foo',
        email: 'foo@example.com',
      },
      {
        id: '2',
        name: 'bar',
        email: 'bar@example.com',
      },
    ];

    const addedOrganizers: Organizer[] = [organizers[1]];

    (useSelector as jest.Mock).mockReturnValue(organizers);

    const wrapper = shallow(
      <AddOrganizerSelect addedOrganizers={addedOrganizers} />,
    );

    const availableOrganizers = wrapper.find(MenuItem);

    expect(availableOrganizers).toHaveLength(1);
    expect(availableOrganizers.text()).toBe(organizers[0].name);
  });

  it('should return null if there are no organizers to add', () => {
    const organizers: Organizer[] = [
      {
        id: '1',
        name: 'foo',
        email: 'foo@example.com',
      },
    ];

    (useSelector as jest.Mock).mockReturnValue(organizers);

    const wrapper = shallow(
      <AddOrganizerSelect addedOrganizers={organizers} />,
    );

    expect(wrapper.type()).toBe(null);
  });

  it('should add an organizer when selected', () => {
    const organizers: Organizer[] = [
      {
        id: '1',
        name: 'foo',
        email: 'foo@example.com',
      },
    ];

    (useSelector as jest.Mock).mockReturnValue(organizers);

    const wrapper = shallow(<AddOrganizerSelect addedOrganizers={[]} />);

    wrapper.find(Select).invoke('onChange')?.(
      { target: { value: '1' } } as any,
      {} as any,
    );

    expect(addOrganizer).toBeCalledWith('1234', '1');
  });

  it('should get a list of organizers if there are no organizers in state', async () => {
    (useSelector as jest.Mock).mockReturnValue([]);

    let wrapper: ReactWrapper<any, Readonly<{}>>;

    await act(async () => {
      wrapper = mount(<AddOrganizerSelect addedOrganizers={[]} />);
    });

    expect(getOrganizerList).toBeCalledWith();
  });

  it('should not get a list of organizers if there are organizers in state', async () => {
    const organizers: Organizer[] = [
      {
        id: '1',
        name: 'foo',
        email: 'foo@example.com',
      },
    ];

    (useSelector as jest.Mock).mockReturnValue(organizers);

    let wrapper: ReactWrapper<any, Readonly<{}>>;

    await act(async () => {
      wrapper = mount(<AddOrganizerSelect addedOrganizers={[]} />);
    });

    expect(getOrganizerList).not.toBeCalled();
  });
});
