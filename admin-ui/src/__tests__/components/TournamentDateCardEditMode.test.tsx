import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { putDate } from '../../controllers/gamesController';
import TournamentDateCardEditMode from '../../components/TournamentDateCardEditMode';
import { loadTournament } from '../../store/tournament/tournamentSlice';
import { addSnackbar } from '../../store/alert/alertSlice';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockReturnValue({ tournamentId: '1234' }),
}));

jest.mock('../../store');

jest.mock('../../controllers/gamesController', () => ({
  putDate: jest.fn(),
}));

jest.mock('../../store/tournament/tournamentSlice', () => ({
  loadTournament: jest.fn(),
}));

jest.mock('../../store/alert/alertSlice', () => ({
  addSnackbar: jest.fn(),
}));

describe('<TournamentDateCardEditMode', () => {
  it('should call putDate when the form is submitted', async () => {
    (putDate as jest.Mock).mockResolvedValue('game');

    const toggleEditMode = jest.fn();
    const date = new Date(2020, 0, 1).toISOString();
    const length = 2;

    const { getByTestId } = render(
      <TournamentDateCardEditMode
        date={date}
        length={length}
        toggleEditMode={toggleEditMode}
      />,
    );

    const lengthInput = getByTestId('update-length-input').querySelector(
      'input',
    );

    await act(async () => {
      fireEvent.change(lengthInput as Element, {
        target: { value: '3' },
      });
    });

    await act(async () => {
      fireEvent.submit(getByTestId('edit-date-form') as Element);
    });

    expect(putDate).toBeCalledWith('1234', new Date(2020, 0, 1), 3);
    expect(loadTournament).toBeCalledWith('game');
    expect(addSnackbar).toBeCalledWith(expect.any(String));
  });

  it('should default length to "1" if no length is provided', async () => {
    (putDate as jest.Mock).mockResolvedValue('game');

    const toggleEditMode = jest.fn();
    const date = new Date(2020, 0, 1).toISOString();
    const length = 2;

    const { getByTestId } = render(
      <TournamentDateCardEditMode
        date={date}
        length={length}
        toggleEditMode={toggleEditMode}
      />,
    );

    const lengthInput = getByTestId('update-length-input').querySelector(
      'input',
    );

    await act(async () => {
      fireEvent.change(lengthInput as Element, {
        target: { value: '' },
      });
    });

    await act(async () => {
      fireEvent.submit(getByTestId('edit-date-form') as Element);
    });

    expect(putDate).toBeCalledWith('1234', new Date(2020, 0, 1), 1);
  });

  it('should display an error toast if the call fails', async () => {
    (putDate as jest.Mock).mockRejectedValue(new Error());

    const toggleEditMode = jest.fn();
    const date = new Date(2020, 0, 1).toISOString();
    const length = 2;

    const { getByTestId } = render(
      <TournamentDateCardEditMode
        date={date}
        length={length}
        toggleEditMode={toggleEditMode}
      />,
    );

    await act(async () => {
      fireEvent.submit(getByTestId('edit-date-form') as Element);
    });

    expect(putDate).toBeCalledWith('1234', new Date(2020, 0, 1), 2);
    expect(addSnackbar).toBeCalledWith(expect.any(String), 'error');
  });
});
