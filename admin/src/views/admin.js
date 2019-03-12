import React, {Component} from 'react';
import '../../CSS/Admin/admin.css';

import NavigationBar from './navigationBar'
import MenuBar from './menuBar';
import  User from './user';
import Cards from './cards';
import Moderators from './moderator';
import Bookings from './bookings';
import Enquiry from './enquiry';
import Venue from './venue';
import Payment from './payments';

import { Route, Switch } from "react-router-dom";

import {Row, Col} from 'reactstrap';

export default class Admin extends Component {

    render () {

        return (
            <div className="adminBlock">
                    <MenuBar /> 
                <NavigationBar />
                <div className="cardsOuterDiv">
                    <Row>
                        <Col md="4" ><Cards heading = "Weekly Bookings" amount = "34,000"/></Col>
                        <Col md="4"><Cards heading = "Weekly Enquiries" amount = "Black sheep"/></Col>
                        <Col md="4"><Cards heading = "Weekly Revenue" amount = "Black sheep"/></Col>
                    </Row>
                </div>
                <Switch>
                  <Route  path = "/admin/users" component = {User} /> 
                    <Route  path = "/moderators" component = { Moderators } />
                    <Route exact path = "/admin/bookings" component = {Bookings} />
                    <Route exact path = "/admin/enquiries" component = {Enquiry} />
                    <Route exact path = "/admin/venues" component = {Venue} />
                    <Route exact path = "/admin/payments" component = {Payment} />
                </Switch>
            </div>
        );
    }
}