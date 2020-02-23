import { shallow } from 'enzyme';
import React from 'react';
import TournamentPriceCard from '../../components/TournamentPriceCard';

jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockReturnValue(2000),
}));

jest.mock('../../store');

describe('<TournamentPriceCard />', () => {
  it('should convert the price number to string', () => {
    const wrapper = shallow(<TournamentPriceCard />);

    const renderProp = shallow(wrapper.invoke('children')());

    expect(renderProp.text()).toBe('$20.00');
  });
});
