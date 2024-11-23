import react from "react";
import { Navbar } from "react-bootstrap";
const Home=()=>{

    return(
        <Navbar
        style={{
          border: '1px solid',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '4rem',
          padding: '0 1rem',
        }}
      >
        <Navbar.Brand>Welcome to your mail box !!!</Navbar.Brand>
      </Navbar>
    )
}

export default Home;