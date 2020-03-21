import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '..';
import { getOrganizers } from '../../controllers/organizersController';
import { Organizer } from '../../types/Game';

const initialState: Organizer[] = [];

const organizerSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    loadOrganizers(_, action: PayloadAction<Organizer[]>) {
      return action.payload;
    },
  },
});

export default organizerSlice.reducer;

export const { loadOrganizers } = organizerSlice.actions;

export const getOrganizerList = (): AppThunk => dispatch => {
  getOrganizers().then(organizers => {
    dispatch(loadOrganizers(organizers));
  });
};
