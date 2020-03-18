import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import TournamentPriceCardEditMode from '../../components/TournamentPriceCardEditMode';
import { putPrice } from '../../controllers/gamesController';
import { addSnackbar } from '../../store/alert/alertSlice';
import { loadTournament } from '../../store/tournament/tournamentSlice';

jest.mock('react-redux', () => ({
  useSelector: jest.fn().mockReturnValue(2000),
  useDispatch: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('react-router-dom', () => ({
  useParams: jest.fn().mockReturnValue({ tournamentId: '1234' }),
}));

jest.mock('../../store');
jest.mock('../../controllers/gamesController', () => ({
  putPrice: jest.fn(),
}));

jest.mock('../../store/tournament/tournamentSlice', () => ({
  loadTournament: jest.fn(),
}));

jest.mock('../../store/alert/alertSlice', () => ({
  addSnackbar: jest.fn(),
}));

describe('<TournamentPriceCardEditMode />', () => {
  it('should call putPrice when the form is submitted', async () => {
    (putPrice as jest.Mock).mockResolvedValue('game');

    const toggleEditMode = jest.fn();
    const price = 4000;

    const { getByTestId } = render(
      <TournamentPriceCardEditMode
        price={price}
        toggleEditMode={toggleEditMode}
      />,
    );

    const priceInput = getByTestId('tournament-price-input').querySelector(
      'input',
    );

    await act(async () => {
      fireEvent.change(priceInput as Element, {
        target: { value: 10 },
      });
    });

    await act(async () => {
      fireEvent.submit(getByTestId('price-card-edit-mode') as Element);
    });

    expect(putPrice).toBeCalledWith('1234', 1000);
    expect(loadTournament).toBeCalledWith('game');
    expect(addSnackbar).toBeCalledWith(expect.any(String));
  });

  it('should default to zero if no price is added', async () => {
    (putPrice as jest.Mock).mockResolvedValue('game');

    const toggleEditMode = jest.fn();
    const price = 4000;

    const { getByTestId } = render(
      <TournamentPriceCardEditMode toggleEditMode={toggleEditMode} />,
    );

    await act(async () => {
      fireEvent.submit(getByTestId('price-card-edit-mode') as Element);
    });

    expect(putPrice).toBeCalledWith('1234', 0);
  });

  it('should display an error toast if the call fails', async () => {
    (putPrice as jest.Mock).mockRejectedValue(new Error());

    const toggleEditMode = jest.fn();
    const price = 4000;

    const { getByTestId } = render(
      <TournamentPriceCardEditMode
        price={price}
        toggleEditMode={toggleEditMode}
      />,
    );

    const priceInput = getByTestId('tournament-price-input').querySelector(
      'input',
    );

    await act(async () => {
      fireEvent.change(priceInput as Element, {
        target: { value: 10 },
      });
    });

    await act(async () => {
      fireEvent.submit(getByTestId('price-card-edit-mode') as Element);
    });

    expect(putPrice).toBeCalledWith('1234', 1000);
    expect(addSnackbar).toBeCalledWith(expect.any(String), 'error');
  });
});
