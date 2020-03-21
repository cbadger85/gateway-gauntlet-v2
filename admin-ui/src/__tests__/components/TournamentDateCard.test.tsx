import { shallow } from 'enzyme';
import React from 'react';
import { useSelector } from 'react-redux';
import TournamentDateCard, {
  DateDisplay,
} from '../../components/TournamentDateCard';
import TournamentDateCardEditMode from '../../components/TournamentDateCardEditMode';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockReturnValue('1234'),
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

      const dateWrapper = shallow(wrapper.invoke('children')(false, jest.fn()));

      const dateDisplay = dateWrapper.find(DateDisplay);

      expect(dateDisplay.props().date).toEqual(date);

      expect(dateDisplay.props().length).toBe(length);
    });

    it('should show edit mode if isEditMode is true', () => {
      const date = new Date();
      const length = 2;
      (useSelector as jest.Mock).mockReturnValue({
        date: date.toISOString(),
        length,
      });

      const wrapper = shallow(<TournamentDateCard />);

      const toggleEditMode = jest.fn();

      const dateWrapper = shallow(
        wrapper.invoke('children')(true, toggleEditMode),
      );

      const isEditMode = dateWrapper
        .find('[data-testid="edit-date-form"]')
        .exists();

      expect(isEditMode).toBeTruthy();
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
