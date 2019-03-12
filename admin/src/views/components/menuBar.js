import React from 'react';
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

export default function MenuBar () {

    return (
      <div className = "menuBar">
        <Navbar  light expand="md">
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/admin/logout">Logout</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/">GitHub</NavLink>
              </NavItem>
            </Nav>
        </Navbar>
      </div>
    );
}