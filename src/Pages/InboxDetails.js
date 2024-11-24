import React from 'react';
import { Button } from 'react-bootstrap';

const InboxDetails = ({ selectedMessage,backToInbox }) => {
  return (
    <div>
        <Button
            variant='Secondary'
              onClick={backToInbox}
              style={{
                cursor: 'pointer',
                marginBottom:'1rem'
              }}
            >
              back
            </Button>
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '5px',
                padding: '20px',
                backgroundColor: '#fff',
              }}
            >
                <div style={{ border: '1px solid #ddd', borderRadius: '5px',padding: '10px', backgroundColor: '#fff',marginBottom:'4px'}}>
                    <strong style={{color:'grey'}}>From : </strong> {selectedMessage.sender}
                </div>
                <div style={{ border: '1px solid #ddd', borderRadius: '5px',padding: '10px',backgroundColor: '#fff',marginBottom:'4px'}}> <strong style={{color:'grey'}}>subject : </strong>{selectedMessage.subject}</div>
                <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', backgroundColor: '#fff',marginBottom:'4px',height:'250px auto'}}>{selectedMessage.body}</div>
        </div>
    </div>
  );
};

export default InboxDetails;
