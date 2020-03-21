import React from 'react';
import { shallow } from 'enzyme';
import EditMissionsDrawer from '../../components/EditMissionsDrawer';
import EditMissionsForm from '../../components/EditMissionsForm';
import { putMissions } from '../../controllers/gamesController';
import { loadTournament } from '../../store/tournament/tournamentSlice';
import { addSnackbar } from '../../store/alert/alertSlice';

jest.mock('../../controllers/gamesController', () => ({
  putMissions: jest.fn(),
}));

jest.mock('../../store/tournament/tournamentSlice', () => ({
  loadTournament: jest.fn(),
}));

jest.mock('../../store/alert/alertSlice', () => ({
  addSnackbar: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockReturnValue({ tournamentId: '1234' }),
}));

jest.mock('../../store');

beforeEach(jest.clearAllMocks);

describe('<EditMissionDrawer />', () => {
  it('should save the missions when handleSave is called', async () => {
    (putMissions as jest.Mock).mockResolvedValue('game');

    const closeDrawer = jest.fn();
    const wrapper = shallow(
      <EditMissionsDrawer isOpen missions={[]} closeDrawer={closeDrawer} />,
    );

    await wrapper.find(EditMissionsForm).invoke('onSave')(['mission']);

    expect(loadTournament).toBeCalledWith('game');
    expect(addSnackbar).toBeCalledWith(expect.any(String));
  });

  it('should call addSnackbar with an error if the call fails', async () => {
    (putMissions as jest.Mock).mockRejectedValue(new Error());

    const closeDrawer = jest.fn();
    const wrapper = shallow(
      <EditMissionsDrawer isOpen missions={[]} closeDrawer={closeDrawer} />,
    );

    await wrapper.find(EditMissionsForm).invoke('onSave')(['mission']);

    expect(loadTournament).not.toBeCalled();
    expect(addSnackbar).toBeCalledWith(expect.any(String), 'error');
  });
});
