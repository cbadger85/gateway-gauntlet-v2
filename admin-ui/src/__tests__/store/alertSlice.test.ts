import alertReducer, {
  addSnackbar,
  removeSnackbar,
} from '../../store/alert/alertSlice';
import { SnackbarMessage } from '../../types/SnackbarMessage';

// jest.mock('shortid', () => jest.fn().mockReturnValue('1234'));

describe('alertSlice', () => {
  describe('alertReducer', () => {
    it('should add a snackbar when addSnackbar is called', () => {
      const snackbar = {
        id: 'aaaa',
        message: 'foo',
        severity: 'error',
      };

      const alerts = alertReducer(undefined, {
        type: addSnackbar.type,
        payload: snackbar,
      });

      expect(alerts).toEqual({
        current: snackbar.id,
        snackbars: [snackbar],
      });
    });

    it('should remove a snackbar when removeSnackbar is called and clear the current field if it is the current snackbar', () => {
      const snackbar: SnackbarMessage = {
        id: 'aaaa',
        message: 'foo',
        severity: 'error',
      };

      const initialState = {
        current: snackbar.id,
        snackbars: [snackbar],
      };

      const alerts = alertReducer(initialState, {
        type: removeSnackbar.type,
        payload: 'aaaa',
      });

      expect(alerts).toEqual({
        current: undefined,
        snackbars: [],
      });
    });

    it('should remove a snackbar when removeSnackbar is called and not clear the current field if it is not the current snackbar', () => {
      const snackbar1: SnackbarMessage = {
        id: 'aaaa',
        message: 'foo',
        severity: 'error',
      };

      const snackbar2: SnackbarMessage = {
        id: 'bbbb',
        message: 'foo',
        severity: 'error',
      };

      const initialState = {
        current: snackbar2.id,
        snackbars: [snackbar1, snackbar2],
      };

      const alerts = alertReducer(initialState, {
        type: removeSnackbar.type,
        payload: 'aaaa',
      });

      expect(alerts).toEqual({
        current: 'bbbb',
        snackbars: [snackbar2],
      });
    });
  });
});
