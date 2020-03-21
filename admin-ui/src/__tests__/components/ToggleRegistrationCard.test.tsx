import { shallow } from 'enzyme';
import React from 'react';
import ToggleRegistrationCard from '../../components/ToggleRegistrationCard';
import { useSelector } from 'react-redux';
import { GameStatus } from '../../types/Game';
import {
  openRegistration,
  closeRegistration,
} from '../../store/tournament/tournamentSlice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
  useSelector: jest.fn(),
}));

jest.mock('../../store');

jest.mock('../../store/tournament/tournamentSlice', () => ({
  openRegistration: jest.fn(),
  closeRegistration: jest.fn(),
}));

describe('<ToggleRegistrationCard />', () => {
  it('should show "OPEN REGISTRATION" if registration is closed', () => {
    (useSelector as jest.Mock).mockReturnValue(GameStatus.REGISTRATION_CLOSED);
    const wrapper = shallow(<ToggleRegistrationCard />);

    const openRegistrationButton = wrapper
      .find('[data-testid="open-registration-button"]')
      .exists();

    expect(openRegistrationButton).toBeTruthy();
  });

  it('should show "OPEN REGISTRATION" if game status is new', () => {
    (useSelector as jest.Mock).mockReturnValue(GameStatus.NEW);
    const wrapper = shallow(<ToggleRegistrationCard />);

    const openRegistrationButton = wrapper
      .find('[data-testid="open-registration-button"]')
      .exists();

    expect(openRegistrationButton).toBeTruthy();
  });

  it('should show "CLOSE REGISTRATION" if game status is neither new or closed', () => {
    (useSelector as jest.Mock).mockReturnValue(GameStatus.REGISTRATION_OPEN);
    const wrapper = shallow(<ToggleRegistrationCard />);

    const closeRegistrationButton = wrapper
      .find('[data-testid="close-registration-button"]')
      .exists();

    expect(closeRegistrationButton).toBeTruthy();
  });

  it('should call openRegistration when the open registration button is clicked', () => {
    (useSelector as jest.Mock).mockReturnValue(GameStatus.REGISTRATION_CLOSED);
    const wrapper = shallow(<ToggleRegistrationCard />);

    wrapper
      .find('[data-testid="open-registration-button"]')
      .invoke('onClick')?.({} as any);

    expect(openRegistration).toBeCalledWith();
  });

  it('should call openRegistration when the open registration button is clicked', () => {
    (useSelector as jest.Mock).mockReturnValue(GameStatus.REGISTRATION_OPEN);
    const wrapper = shallow(<ToggleRegistrationCard />);

    wrapper
      .find('[data-testid="close-registration-button"]')
      .invoke('onClick')?.({} as any);

    expect(closeRegistration).toBeCalledWith();
  });
});
