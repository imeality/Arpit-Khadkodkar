import React, {Component, Fragment} from 'react';
import logo from '../../../images/Project/logo.png';
import '../../../CSS/Components/navBar.css';

import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
     } from 'reactstrap';

function SingleNavItem(props) {
    return (
        <Fragment>
            <NavItem>
                <NavLink href = {props.link}>{props.name}</NavLink>
            </NavItem>
        </Fragment>
    );
}


class NavigationBar extends Component {

    constructor(props) {
        super(props);
    
        this.toggle = this.toggle.bind(this);
        this.state = {
          isOpen: false
        };
    }

    toggle() {
       this.setState({
         isOpen: !this.state.isOpen
       });
    }

    createNavItem (data) {
      return <SingleNavItem name = {data.name} link = {data.link} key = {data.name}/>;
    }

    retriveNavItem (data) {
      return data.map(this.createNavItem);
    }

    render(){

        return (
            <div>
                <Navbar className="custom-navbar" dark expand="sm">
                    <NavbarBrand className="mr-auto"><img src = {logo} className = "logo-image " /></NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar> 
                        <Nav className="ml-auto" navbar>
                            {this.retriveNavItem(this.props.data)}
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

export default NavigationBar;