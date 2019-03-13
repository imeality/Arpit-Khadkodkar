import React from 'react';
import Cards from '../components/cards';
import {Row, Col} from 'reactstrap';
import Axios from 'axios';
import {newBookings, newUsers, moderatorRequest, newEnquiries, venuesListed, paymentReceived, totalRevenue } from '../../api/api';
 
export default class Dashboard extends React.Component {

    componentDidMount () {
        Axios.defaults.headers.common['authorization'] = "Bearer " + localStorage.getItem('token');
        Axios.all([newBookings(), newUsers(), newEnquiries(), moderatorRequest(), venuesListed(), paymentReceived(), totalRevenue()])
        .then(Axios.spread( (nbCount, nuCount, neCount, mrCount, vlCount, prCount, trCount) => {
            // this.setState({
            //     newUsers: n,
            //     moderatorRequest: 0,
            //     newBookings: 0,
            //     newEnquiries: 0,
            //     venuesListed: 0,
            //     paymentReceived: 0,
            //     totalRevenue: 0
            // })
            console.log("new user count ==> ", nuCount.data.data );
            console.log("new bookings count ==> ", nbCount.data.data );
            console.log("new enquiry count ==> ", neCount.data.data );
            console.log("new moderator request count ==> ", mrCount.data.data );
            console.log("new venues listed count ==> ", vlCount );
            console.log("new payment received count ==> ", prCount.data.data );
            console.log("new total revenue count ==> ", trCount.data.data );
        }))
    }

    render () {
        return (

            <React.Fragment>
            <Row>
                <Col md="4" ><a href = "/admin/users" ><Cards heading = "New Users" amount = "34,000"/></a></Col>
                <Col md="4"><a href = "/admin/moderators" ><Cards heading = "Moderators request" amount = "Black sheep"/></a></Col>
                <Col md="4"><a href = "/admin/bookings" ><Cards heading = "New Bookings" amount = "Black sheep"/></a></Col>
            </Row>
        
            <Row>
                <Col md="4" ><a href = "/admin/enquiries" ><Cards heading = "New Enquiries" amount = "34,000"/></a></Col>
                <Col md="4"><a href = "/admin/venues" ><Cards heading = "Venues Listed" amount = "Black sheep"/></a></Col>
                <Col md="4"><a href = "/admin/payments" ><Cards heading = "Payment Received" amount = "Black sheep"/></a></Col>
            </Row>

            <Row>
                <Col md = {{size: 4, offset: 4}}><a href = "" ><Cards heading = "Total Revenue" amount = "Black sheep"/></a></Col>
            </Row>
            </React.Fragment>
        );
    }
}
