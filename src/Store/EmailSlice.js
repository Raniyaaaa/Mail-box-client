import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

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
      const email = state.messages.find((message) => message.id === id);
      if (email && !email.read) {
        email.read = true;
        state.unreadCount -= 1;
      }
      state.loading = false;
    },
    addEmail(state, action) {
      state.messages = [...state.messages, action.payload];
      state.loading = false;
    },
    removeEmail(state, action) {
      const messageId = action.payload;
      state.messages = state.messages.filter((message) => message.id !== messageId);
      state.unreadCount = state.messages.filter((message) => !message.read).length;
      state.loading = false;
    },
  },
});

export const { setLoading, setError, setEmails, updateEmailStatus, addEmail, removeEmail } = emailSlice.actions;

export const fetchReceivedEmails = (email) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axios.get(`your_url/${email}/received.json`);
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


export const deleteEmail = (email, messageId) => async (dispatch) => {
  dispatch(setLoading());
  try {

    // const data=await axios.get(`${your_url}/${email}/received/${messageId}.json`);
    // await axios.post(`${your_url}/${email}/deleted.json`, data.data);

    await axios.delete(`your_url/${email}/received/${messageId}.json`);

    dispatch(removeEmail(messageId));
  } catch (error) {
    dispatch(setError('Error deleting email'));
  }
};

// Mark email as read
export const markAsRead = (email, id) => async (dispatch) => {
  dispatch(setLoading());
  try {
    await axios.patch(`your_url/${email}/received/${id}.json`, { read: true });
    dispatch(updateEmailStatus({ id }));
  } catch (error) {
    console.error('Error updating message read status', error);
    dispatch(setError('Error updating message status'));
  }
};


export const sendEmail = (formData, senderEmail, receiveEmail) => async (dispatch) => {
  dispatch(setLoading());
  try {
    await axios.post(`your_url/${senderEmail}/send.json`, formData);
    console.log("Sender email sent successfully.");

    await axios.post(`your_url/${receiveEmail}/received.json`, formData);
    console.log("Receiver email received successfully.");


    dispatch(addEmail(formData));
  } catch (error) {
    console.error("Error sending email:", error);
    dispatch(setError('Error sending email'));
  }
};

export default emailSlice.reducer;
