import React, {Component} from 'react';

import {Button} from 'reactstrap';

import '../../CSS/First-Page/topLeft.css';

import '../../font-awesome/css/font-awesome.min.css'; 

class TopLeft extends Component{

    render () {

        return (
            <div className = "topLeftDiv">
                <a className = "ele" href = "/login"><i className = "fa fa-user-o" /> Login</a>
                <a className = "ele" href = "/listVenue"><i className = "fa fa-list" /> List Venue</a>
                <a href = "/listVenue" className = "ele"><i className = "fa fa-sign-in" /> Join</a>
            </div>
        );
    }
}

export default TopLeft;