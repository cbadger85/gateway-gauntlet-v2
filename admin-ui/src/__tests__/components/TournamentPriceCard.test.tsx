import { shallow } from 'enzyme';
import React, { ReactElement } from 'react';
import TournamentPriceCard from '../../components/TournamentPriceCard';
import TournamentPriceCardEditMode from '../../components/TournamentPriceCardEditMode';
import TournamentInfoToggleCard from '../../components/TournamentInfoToggleCard';

jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockReturnValue(2000),
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockReturnValue({ tournamentId: '1234' }),
}));

jest.mock('../../store');

describe('<TournamentPriceCard />', () => {
  it('should convert the price number to string', () => {
    const wrapper = shallow(<TournamentPriceCard />);

    const renderProp = shallow(wrapper.invoke('children')());

    expect(renderProp.text()).toBe('$20.00');
  });

  it('should show the edit mode if isEditMode is true', () => {
    const wrapper = shallow(<TournamentPriceCard />);

    const renderProp = shallow(wrapper.invoke('children')(true));

    const editMode = renderProp.find('[data-testid="price-card-edit-mode"]');

    expect(editMode.exists()).toBeTruthy();
  });
});
