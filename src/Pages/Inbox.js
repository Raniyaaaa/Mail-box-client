import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReceivedEmails, markAsRead } from '../Store/EmailSlice';
import { BsCircleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import InboxDetails from './InboxDetails';

const Inbox = () => {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.email);
  const email = localStorage.getItem('email') ? localStorage.getItem('email').replace(/[@.]/g, '') : '';
  const [selectedMessage, setSelectedMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      dispatch(fetchReceivedEmails(email));
    }
  }, [dispatch, email]);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(email, id));
  };

  const readHandler = (message) => {
    handleMarkAsRead(message.id);
    setSelectedMessage(message); 
    console.log(message);
};

  const backToInbox = () => {
    setSelectedMessage(null); 
  };

  if (loading)
    return (
      <div style={{ textAlign: 'center', margin: '20px', fontSize: '18px', color: '#555' }}>
        Loading...
      </div>
    );
  if (error)
    return (
      <div style={{ textAlign: 'center', margin: '20px', fontSize: '18px', color: 'red' }}>
        Error: {error}
      </div>
    );

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div style={{ flexGrow: 1, padding: '20px', backgroundColor: '#f9f9f9' }}>
        {!selectedMessage ? (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px solid #ddd',
                paddingBottom: '10px',
                marginBottom: '15px',
              }}
            >
              <h3 style={{ margin: 0 }}>Inbox</h3>
            </div>

            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              {messages.length > 0 ? (
                messages.map((message) => (
                  <li
                    key={message.id}
                    onClick={() => readHandler(message)}
                    style={{
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      marginBottom: '10px',
                      backgroundColor: message.read ? '#fff' : '#e8f0fe',
                      cursor: 'pointer',
                      padding: '10px',
                      fontWeight: message.read? 'none':'bold'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {!message.read && (
                        <div style={{ fontSize: '8px', color: 'blue', marginRight: '8px' }}>
                          <BsCircleFill />
                        </div>
                      )}
                      <div style={{ fontSize: '14px', color: '#555', marginRight: '8px' }}>
                        {message.sender} | {message.subject}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#888',
                          overflow: 'hidden',
                        }}
                      >
                        {message.body || 'No preview available.'}
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
          <InboxDetails selectedMessage={selectedMessage} backToInbox={backToInbox}/>
        )}
      </div>
    </div>
  );
};

export default Inbox;
