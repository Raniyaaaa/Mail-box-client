import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  receivedMessages: [],
  sendMessages: [],
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
      state.error = null;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    setReceivedEmails(state, action) {
      state.receivedMessages = action.payload;
      state.unreadCount = action.payload.filter((message) => !message.read).length;
      state.loading = false;
    },
    setSendEmails(state, action) {
      state.sendMessages = action.payload;
      state.loading = false;
    },
    updateEmailStatus(state, action) {
      const { id } = action.payload;
      const email = state.receivedMessages.find((message) => message.id === id);
      if (email && !email.read) {
        email.read = true;
        state.unreadCount -= 1;
      }
      state.loading = false;
    },
    addReceivedEmail(state, action) {
      state.receivedMessages.push(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
      state.loading = false;
    },
    addSendEmail(state, action) {
      state.sendMessages.push(action.payload);
      state.loading = false;
    },
    removeReceivedEmail(state, action) {
      const messageId = action.payload;
      state.receivedMessages = state.receivedMessages.filter((message) => message.id !== messageId);
      state.unreadCount = state.receivedMessages.filter((message) => !message.read).length;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setError,
  setReceivedEmails,
  setSendEmails,
  updateEmailStatus,
  addReceivedEmail,
  addSendEmail,
  removeReceivedEmail,
} = emailSlice.actions;

export const fetchReceivedEmails = (email) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axios.get(`your_url/${email}/received.json`);
    console.log(`your_url/${email}/received.json`)
    console.log(response.data)
    const messagesData = response.data || {};
    const formattedEmails = Object.keys(messagesData).map((key) => ({
      id: key,
      ...messagesData[key],
    }));
    dispatch(setReceivedEmails(formattedEmails));
  } catch (error) {
    dispatch(setError('Error fetching received messages'));
  }
};

export const fetchSendEmails = (email) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await axios.get(`your_url/${email}/send.json`);
    console.log(`your_url/${email}/send.json`)
    console.log(response.data)
    const messagesData = response.data || {};
    const formattedEmails = Object.keys(messagesData).map((key) => ({
      id: key,
      ...messagesData[key],
    }));
    dispatch(setSendEmails(formattedEmails));
  } catch (error) {
    dispatch(setError('Error fetching send messages'));
  }
};

export const deleteEmail = (email, messageId) => async (dispatch) => {
  dispatch(setLoading());
  try {
    await axios.delete(`your_url/${email}/received/${messageId}.json`);
    dispatch(removeReceivedEmail(messageId));
  } catch (error) {
    dispatch(setError('Error deleting received email'));
  }
};

export const markAsRead = (email, id) => async (dispatch) => {
  dispatch(setLoading());
  try {
    await axios.patch(`your_url/${email}/received/${id}.json`, { read: true });
    dispatch(updateEmailStatus({ id }));
    
  } catch (error) {
    dispatch(setError('Error updating email status'));
  }
};

export const sendEmail = (formData, senderEmail, receiverEmail) => async (dispatch) => {
  dispatch(setLoading());
  try {

    await axios.post(`your_url/${senderEmail}/send.json`, formData);
    dispatch(addSendEmail(formData));

    await axios.post(`your_url/${receiverEmail}/received.json`, formData);
    
  } catch (error) {
    dispatch(setError('Error sending email'));
  }
};

export default emailSlice.reducer;
