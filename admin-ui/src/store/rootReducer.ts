import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import authReducer from './auth/authSlice';
import alertReducer from './alert/alertSlice';
import tournamentReducer from './tournament/tournamentSlice';
import organizersReducer from './organizer/organizerSlice';

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  alert: alertReducer,
  tournament: tournamentReducer,
  organizers: organizersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
