import { createAction } from '@reduxjs/toolkit';
import { User } from '../types/User';

export const loginSuccess = createAction<User>('auth/loginSuccess');
export const logoutSucess = createAction('auth/logoutSuccess');
