import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const MainNavigation=()=>{
    return(
        <Navbar bg="white">
            <Container>
            <Nav className="me-auto">
                <NavLink to='/' style={{color:'powderblue',fontSize:'1.5rem',marginRight: '1rem',textDecoration: 'none'}}>MyWebLink</NavLink>
                <NavLink to='/home' style={{color: 'grey', marginRight: '1rem',textDecoration: 'none' }}>Home</NavLink>
                <NavLink to='/products' style={{color: 'grey', marginRight: '1rem',textDecoration: 'none' }}>Products</NavLink>
                <NavLink to='/aboutus' style={{color: 'grey', marginRight: '1rem',textDecoration: 'none' }}>About Us</NavLink>
            </Nav>    
            </Container>
        </Navbar>
    )
}

export default MainNavigation;