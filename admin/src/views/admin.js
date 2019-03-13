import React, {Component} from 'react';
import '../css/admin.css';

import NavigationBar from './components/navigationBar'
import MenuBar from './components/menuBar';
import  User from './pages/user';

import Moderators from './pages/moderator';
import Bookings from './pages/bookings';
import Enquiry from './pages/enquiry';
import Venue from './pages/venue';
import Payment from './pages/payments';
import Dashboard from './pages/dashboard';

import { Route, Switch } from "react-router-dom";

// import {} from '../api/api'
import Axios from 'axios';


export default class Admin extends Component {

    constructor(){
        super();

        this.state = {
            newUsers: 0,
            moderatorRequest: 0,
            newBookings: 0,
            newEnquiries: 0,
            venuesListed: 0,
            paymentReceived: 0,
            totalRevenue: 0
        };
    }

    componentDidMount () {
        Axios.defaults.headers.common['authorization'] = "Bearer " + localStorage.getItem('token');
        // console.log(" Token is -->   ", localStorage.getItem('token'));
    } 

    render () { 

        return (
            <div className="adminBlock">
                    <MenuBar /> 
                <NavigationBar />
                <div className="cardsOuterDiv">
                    
                <Switch>
                    <Route path = "/admin" exact component={Dashboard} />
                  <Route  path = "/admin/users" component = {User} /> 
                    <Route  path = "/admin/moderators" component = {Moderators} />
                    <Route exact path = "/admin/bookings" component = {Bookings} />
                    <Route exact path = "/admin/enquiries" component = {Enquiry} />
                    <Route exact path = "/admin/venues" component = {Venue} />
                    <Route exact path = "/admin/payments" component = {Payment} />
                </Switch>

                </div>
            </div>
        );
    }
}