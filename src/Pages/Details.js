import React from 'react';
import { Button } from 'react-bootstrap';

const Details = ({ selectedMessage,backTo,text,person}) => {
  return (
    <div>
        <Button
            variant='Secondary'
              onClick={backTo}
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
                    <strong style={{color:'grey'}}>{text} : </strong> {person}
                </div>
                <div style={{ border: '1px solid #ddd', borderRadius: '5px',padding: '10px',backgroundColor: '#fff',marginBottom:'4px'}}> <strong style={{color:'grey'}}>subject : </strong>{selectedMessage.subject}</div>
                <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', backgroundColor: '#fff',marginBottom:'4px',height:'250px auto',overflow:'hidden'}}>{selectedMessage.body}</div>
        </div>
    </div>
  );
};

export default Details;
