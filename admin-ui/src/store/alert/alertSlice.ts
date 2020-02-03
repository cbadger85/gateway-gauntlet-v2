import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import shortid from 'shortid';
import {
  SnackbarMessage,
  SnackbarMessageSeverity,
} from '../../types/SnackbarMessage';

const initialState: { snackbars: SnackbarMessage[]; current?: string } = {
  snackbars: [],
};

const alertSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    addSnackbar: {
      reducer: (state, action: PayloadAction<SnackbarMessage>) => {
        state.current = action.payload.id;
        state.snackbars.push(action.payload);
        return state;
      },
      prepare: (
        message: string,
        severity: SnackbarMessageSeverity = 'success',
      ) => ({
        payload: {
          id: shortid(),
          message,
          severity,
        },
      }),
    },
    removeSnackbar(state, action: PayloadAction<string>) {
      state.current =
        state.current !== action.payload ? state.current : undefined;
      state.snackbars = state.snackbars.filter(
        snackbar => snackbar.id !== action.payload,
      );
      return state;
    },
  },
});

export const { removeSnackbar, addSnackbar } = alertSlice.actions;

export default alertSlice.reducer;
