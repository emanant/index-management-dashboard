import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NavBar from 'react-bootstrap/NavBar';
import Nav from 'react-bootstrap/Nav'

class NavHeader extends Component {

    render() {
        return (
            <>
                <NavBar sticky='top' bg='light' expand='lg'>
                    <NavBar.Brand as={Link} to='/'>
                        DemoApp
                    </NavBar.Brand>
                    <Nav className='mr=auto'>
                        <Nav.Link as={Link} to='/board'>
                            Board
                        </Nav.Link>
                    </Nav>
                    <Nav className='ml-auto'>
                        <Nav.Link as={Link} to='/'>
                            Login
                        </Nav.Link>
                    </Nav>
                </NavBar>
            </>
        )
    }
}

export default NavHeader;