import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import authReducer from './auth/authSlice';
import alertReducer from './alert/alertSlice';

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  alert: alertReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
