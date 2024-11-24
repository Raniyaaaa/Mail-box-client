import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./AuthSlice"
import emailReducer from './EmailSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    email: emailReducer,
  },
});

export default store;
