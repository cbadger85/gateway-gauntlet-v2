import React from 'react';
import { useSelector } from 'react-redux';
import { shallow } from 'enzyme';
import { GameStatus } from '../../types/Game';
import Chip from '@material-ui/core/Chip';
import TournamentPageHeader from '../../components/TournamentPageHeader';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('<TournamentPageHeader />', () => {
  it('should show a `NEW` chip if the tournament has a new status', () => {
    (useSelector as jest.Mock).mockReturnValue([
      'tournament 1',
      GameStatus.NEW,
    ]);
    const wrapper = shallow(<TournamentPageHeader />);

    const label = wrapper.find(Chip).props().label;

    expect(label).toBe('NEW');
  });

  it('should show a `REGISTRATION OPEN` chip if the tournament has an open registration status', () => {
    (useSelector as jest.Mock).mockReturnValue([
      'tournament 1',
      GameStatus.REGISTRATION_OPEN,
    ]);
    const wrapper = shallow(<TournamentPageHeader />);

    const label = wrapper.find(Chip).props().label;

    expect(label).toBe('REGISTRATION OPEN');
  });

  it('should show a `REGISTRATION OPEN` chip if the tournament has a closed registration status', () => {
    (useSelector as jest.Mock).mockReturnValue([
      'tournament 1',
      GameStatus.REGISTRATION_CLOSED,
    ]);
    const wrapper = shallow(<TournamentPageHeader />);

    const label = wrapper.find(Chip).props().label;

    expect(label).toBe('REGISTRATION CLOSED');
  });
});
