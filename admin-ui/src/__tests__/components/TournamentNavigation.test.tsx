import React from 'react';
import { shallow } from 'enzyme';
import TournamentNavigation from '../../components/TournamentNavigation';
import NavLink from '../../components/NavLink';

jest.mock('../../utils/history', () => ({
  location: { pathname: '/tournaments/123' },
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockReturnValue({ tournamentId: '123' }),
}));

describe('<TournamentNavigation />', () => {
  it('should show the active link', () => {
    const wrapper = shallow(<TournamentNavigation />);

    const activeLink = wrapper
      .find(NavLink)
      .findWhere(link => link.props().to === '/tournaments/123');

    expect(activeLink.props().isActive).toBeTruthy();
  });
});
