import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginSuccess, logoutSucess } from '../auth/authSlice';

const initialState: User = {
  firstName: '',
  lastName: '',
  email: '',
  id: '',
  username: '',
  roles: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    [loginSuccess.type](_, action: PayloadAction<User>) {
      return action.payload;
    },
    [logoutSucess.type]() {
      return initialState;
    },
  },
});

export default userSlice.reducer;

export interface User {
  id: string;
  username: string;
  email: string;
  roles: Role[];
  firstName: string;
  lastName: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}
