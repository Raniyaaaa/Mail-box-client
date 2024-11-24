import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    email: localStorage.getItem('email') || '',
    isLoggedIn: false,
  },
  reducers: {
    login(state, action) {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.isLoggedIn = true;
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
