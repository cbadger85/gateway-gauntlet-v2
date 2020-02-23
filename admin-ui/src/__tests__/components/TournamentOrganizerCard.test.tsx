import React from 'react';
import { shallow } from 'enzyme';
import TournamentOrganizersCard from '../../components/TournamentOrganizersCard';
import TournamentOrganizerTableRow from '../../components/TournamentOrganizerTableRow';

jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockReturnValue([
    {
      id: '1234',
      name: 'foo bar',
      email: 'bar@example.com',
    },
    {
      id: '5678',
      name: 'foo baz',
      email: 'baz@example.com',
    },
  ]),
}));

describe('<TournamentOrganizerCard />', () => {
  it('should show a list of TournamentOrganizerTableRows', () => {
    const wrapper = shallow(<TournamentOrganizersCard />);

    expect(wrapper.find(TournamentOrganizerTableRow)).toHaveLength(2);
  });
});
