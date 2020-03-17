import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { shallow } from 'enzyme';
import TournamentDateCard, {
  DateDisplay,
} from '../../components/TournamentDateCard';
import TournamentInfoToggleCard from '../../components/TournamentInfoToggleCard';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('TournamentDateCard', () => {
  describe('<TournamentDateCard />', () => {
    it('should pass date and length to DateDisplay component', () => {
      const date = new Date();
      const length = 2;
      (useSelector as jest.Mock).mockReturnValue({
        date: date.toISOString(),
        length,
      });

      const wrapper = shallow(<TournamentDateCard />);

      const infoCard = wrapper.find(TournamentInfoToggleCard);

      const dateWrapper = shallow(
        infoCard.props().children(false, jest.fn()) as ReactElement,
      );

      const dateDisplay = dateWrapper.find(DateDisplay);

      expect(dateDisplay.props().date).toEqual(date);

      expect(dateDisplay.props().length).toBe(length);
    });
  });

  describe('DateDislay', () => {
    it('should display one date if no length is 1', () => {
      const date = new Date();
      date.setDate(1);
      date.setMonth(0);
      date.setFullYear(2020);

      const wrapper = shallow(<DateDisplay date={date} />);

      expect(wrapper.text()).toBe('Jan 1st, 2020');
    });

    it('should display a range of dates if no length is greater than 1', () => {
      const date = new Date();
      date.setDate(1);
      date.setMonth(0);
      date.setFullYear(2020);

      const wrapper = shallow(<DateDisplay date={date} length={2} />);

      expect(wrapper.text()).toBe('Jan 1st - 2nd, 2020');
    });

    it('should display two months if the date is a range and goes across two months', () => {
      const date = new Date();
      date.setDate(31);
      date.setMonth(0);
      date.setFullYear(2020);

      const wrapper = shallow(<DateDisplay date={date} length={2} />);

      expect(wrapper.text()).toBe('Jan 31st - Feb 1st, 2020');
    });
  });
});
