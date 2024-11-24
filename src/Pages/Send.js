import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReceivedEmails, fetchSendEmails, markAsRead } from '../Store/EmailSlice';
import { BsCircleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import Details from './Details';

const Inbox = () => {
  const dispatch = useDispatch();
  const { sendMessages, loading, error } = useSelector((state) => state.email || {});
  const email = localStorage.getItem('email') ? localStorage.getItem('email').replace(/[@.]/g, '') : '';
  const [selectedMessage, setSelectedMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      dispatch(fetchSendEmails(email));
      dispatch(fetchReceivedEmails(email));
    }
  }, [dispatch, email]);


  const readHandler = (message) => {
    setSelectedMessage(message); 
    console.log(message);
  };

  const backToSend = () => {
    setSelectedMessage(null); 
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5' }}>
      <div style={{ flexGrow: 1, padding: '20px', backgroundColor: '#f9f9f9' }}>
        {!selectedMessage ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '15px' }}>
              <h3 style={{ margin: 0 }}>Send</h3>
            </div>

            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              {sendMessages.length > 0 ? (
                sendMessages.map((message) => (
                  <li
                    key={message.id}
                    onClick={() => readHandler(message)}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      marginBottom: '10px',
                      backgroundColor: '#e8f0fe',
                      cursor: 'pointer',
                      padding: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ fontSize: '14px', color: '#555', marginRight: '8px' }}>
                        {message.recipient} | {message.subject}
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  No messages available.
                </li>
              )}
            </ul>
          </>
        ) : (
          <Details selectedMessage={selectedMessage} backTo={backToSend} text="To" person={selectedMessage.recipient} />
        )}
      </div>
    </div>
  );
};

export default Inbox;
