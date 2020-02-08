import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';
import { loginSuccess, logoutSucess } from '../actions';

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
