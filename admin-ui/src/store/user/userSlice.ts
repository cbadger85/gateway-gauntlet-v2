import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginSuccess, logoutSucess } from '../auth/authSlice';
import { User } from '../../types/User';

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
