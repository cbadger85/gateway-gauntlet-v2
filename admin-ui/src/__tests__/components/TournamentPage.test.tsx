import { renderHook } from '@testing-library/react-hooks';
import { shallow } from 'enzyme';
import React from 'react';
import { useSelector } from 'react-redux';
import TournamentPage, { useGetTournament } from '../../pages/TournamentPage';
import { getTournament } from '../../store/tournament/tournamentSlice';

jest.mock('../../store');

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockReturnValue({ tournamentId: '1234' }),
  Switch: () => <div />,
  Route: () => <div />,
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('../../store/tournament/tournamentSlice', () => ({
  getTournament: jest.fn(),
}));

describe('<TournamentPage />', () => {
  it('should return null if the tournament is not loaded', () => {
    (useSelector as jest.Mock).mockReturnValue(false);

    const wrapper = shallow(<TournamentPage />);

    expect(wrapper.type()).toBe(null);
  });

  it('should not return null if the tournament is loaded', () => {
    (useSelector as jest.Mock).mockReturnValue(true);

    const wrapper = shallow(<TournamentPage />);

    expect(wrapper.type()).not.toBe(null);
  });

  describe('useGetTournament', () => {
    renderHook(() => useGetTournament('1234'));

    expect(getTournament).toBeCalledWith('1234');
  });
});
