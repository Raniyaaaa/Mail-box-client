import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  email: localStorage.getItem('email') || '',
  isLoggedIn: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.isLoggedIn = true;
      localStorage.setItem('token', state.token);
      localStorage.setItem('email', state.email);
    },
    logout(state) {
      state.token = null;
      state.email = '';
      state.isLoggedIn = false;
      localStorage.removeItem('token');
      localStorage.removeItem('email');
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
