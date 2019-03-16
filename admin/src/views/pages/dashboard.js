import React from 'react';
import Cards from '../components/cards';
import {Row, Col} from 'reactstrap';
import Axios from 'axios';
import {newBookings, newUsers, moderatorRequest, newEnquiries, venuesListed, paymentReceived, totalRevenue } from '../../api/api';
 
export default class Dashboard extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            newUsers: 0,
            moderatorRequest: 0,
            newBookings: 0,
            newEnquiries: 0,
            venuesListed: 0,
            paymentReceived: 0,
            totalRevenue: 0
        }
    }

    componentDidMount () {
        Axios.defaults.headers.common['authorization'] = "Bearer " + localStorage.getItem('token');
        Axios.all([newBookings(), newUsers(), newEnquiries(), moderatorRequest(), venuesListed(), paymentReceived(), totalRevenue()])
        .then(Axios.spread( (nbCount, nuCount, neCount, mrCount, vlCount, prCount, trCount) => {
            this.setState({
                newUsers: nuCount.data.data,
                moderatorRequest: mrCount.data.data,
                newBookings: nbCount.data.data,
                newEnquiries: neCount.data.data,
                venuesListed: vlCount.data.data,
                paymentReceived: prCount.data.data,
                totalRevenue: trCount.data.data
            })

        }))
    }

    render () {
        return (

            <React.Fragment>
            <Row>
                <Col md="4" ><a href = "/admin/users" ><Cards heading = "New Users" amount = {this.state.newUsers} /></a></Col>
                <Col md="4"><a href = "/admin/moderators" ><Cards heading = "Moderators request" amount = {this.state.moderatorRequest} /></a></Col>
                <Col md="4"><a href = "/admin/bookings" ><Cards heading = "New Bookings" amount = {this.state.newBookings}/></a></Col>
            </Row>
        
            <Row>
                <Col md="4" ><a href = "/admin/enquiries" ><Cards heading = "New Enquiries" amount = {this.state.newEnquiries}/></a></Col>
                <Col md="4"><a href = "/admin/venues" ><Cards heading = "Venues Listed" amount = {this.state.venuesListed}/></a></Col>
                <Col md="4"><a href = "/admin/payments" ><Cards heading = "Payment Received" amount = {this.state.paymentReceived}/></a></Col>
            </Row>

            <Row>
                <Col md = {{size: 4, offset: 4}}><a href = "/admin/totalRevenue" ><Cards heading = "Total Revenue" amount = {this.state.totalRevenue}/></a></Col>
            </Row>
            </React.Fragment>
        );
    }
}
