import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmails,markAsRead } from '../Store/EmailSlice';

const Inbox = () => {
  const dispatch = useDispatch();
  const { messages, unreadCount, loading, error } = useSelector((state) => state.email);
  const email = localStorage.getItem('email') ? localStorage.getItem('email').replace(/[@.]/g, '') : '';

  useEffect(() => {
    if (email) {
      dispatch(fetchEmails(email));
    }
  }, [dispatch, email]);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(email, id));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Inbox</h1>
      <div>Unread Messages: {unreadCount}</div>
      <ul>
        {messages.length > 0 ? (
          messages.map((message) => (
            <li
              key={message.id}
              onClick={() => handleMarkAsRead(message.id)}
              style={{
                fontWeight: message.read ? 'normal' : 'bold',
                listStyleType: 'none',
              }}
            >
              {!message.read && <span style={{ color: 'blue' }}>•</span>} 
              {message.sender} | {message.subject}
            </li>
          ))
        ) : (
          <li>No messages available.</li>
        )}
      </ul>
    </div>
  );
};

export default Inbox;
