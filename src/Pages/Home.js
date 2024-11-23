import { useState } from "react";
import { Navbar,Button } from "react-bootstrap";
import ComposeEmail from "./ComposeEmail";
const Home=()=>{
    const [showCompose,setShowCompose]=useState(false)
    const handleShow=()=> setShowCompose(true);
    const handleClose=()=> setShowCompose(false)
    return(
      <>
        <Navbar
        style={{
          border: '1px solid',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '4rem',
          padding: '0 1rem',
        }}>
          <Navbar.Brand>Welcome to your mail box !!!</Navbar.Brand>
        </Navbar>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <Button variant='primary' onClick={handleShow}>Compose</Button>
          <ComposeEmail show={showCompose} onHide={handleClose}/>
        </div>
      </>
        
    )
}

export default Home;