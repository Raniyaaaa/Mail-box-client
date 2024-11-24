import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const your_url = "https://mail-box-client-e699c-default-rtdb.firebaseio.com";
const initialState = {
  messages: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    setEmails(state, action) {
      state.messages = action.payload;
      state.unreadCount = action.payload.filter((message) => !message.read).length;
      state.loading = false;
    },
    updateEmailStatus(state, action) {
      const { id } = action.payload;
      state.messages = state.messages.map((message) =>
        message.id === id ? { ...message, read: true } : message
      );
      state.unreadCount -= 1;
    },
    addEmail(state, action) {
      state.messages = [action.payload, ...state.messages];
    },
  },
});

export const { setLoading, setError, setEmails, updateEmailStatus, addEmail } = emailSlice.actions;

export const fetchEmails = (email) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axios.get(`${your_url}/${email}/received.json`);
    const messagesData = response.data;

    const formattedEmails = messagesData
      ? Object.keys(messagesData).map(key => ({
          id: key,
          ...messagesData[key],
        }))
      : [];

    dispatch(setEmails(formattedEmails));
  } catch (error) {
    dispatch(setError('Error fetching messages'));
  }
};

export const markAsRead = (email, id) => async (dispatch) => {
  try {
    await axios.patch(`${your_url}/${email}/received/${id}.json`, { read: true });
    dispatch(updateEmailStatus({ id }));
  } catch (error) {
    console.error('Error updating message read status', error);
    dispatch(setError('Error updating message status'));
  }
};


export const sendEmail = (formData, sendEmail, receiveEmail) => async (dispatch) => {
  try {

    await axios.post(`${your_url}/${sendEmail}/send.json`, formData);
    console.log("Sender email sent successfully.");

    await axios.post(`${your_url}/${receiveEmail}/received.json`, formData);
    console.log("Receiver email received successfully.");

    dispatch(addEmail(formData));
  } catch (error) {
    console.error("Error sending email:", error);
    dispatch(setError('Error sending email'));
  }
};

export default emailSlice.reducer;
