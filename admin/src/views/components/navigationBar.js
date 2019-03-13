import React from 'react';

// import {Link} from 'react-router-dom';
// import {NavbarToggler, Collapse} from 'reactstrap';

export default class NavigationBar extends React.Component {
    // constructor(props) {
    //   super(props);
  
    //   this.toggle = this.toggle.bind(this);
    //   this.state = {
    //     isOpen: false
    //   };
    // }
    // toggle() {
    //   this.setState({
    //     isOpen: !this.state.isOpen
    //   });
    // }

    render () {

        return (
            <div className="sidebar">
                {/* <NavbarToggler className = "toggler" onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar> */}
                <a href= "/admin" ><i className="fa fa-dashboard"></i> Dashboard</a><hr/>
                <a href="/admin/users"><i className="fa fa-fw fa-wrench"></i> User</a>
                <a href="/admin/moderators"><i className="fa fa-fw fa-user"></i> Moderators</a>
                <a href="/admin/bookings"><i className="fa fa-book" ></i>   Bookings</a>
                <a href="/admin/enquiries"><i className="fa fa-send-o"></i> Enquiries</a>
                <a href="/admin/venues"><i className="fa fa-building"></i> Venues</a>
                <a href="/admin/payments"><i className="fa fa-money"></i> Payments</a>
                {/* </Collapse> */}
            </div>
            
        );
    }

}
