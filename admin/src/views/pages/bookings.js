import React from 'react';
import {
    getAllBookings, 
    deleteBooking,
    editBookings,
    getRowsCount
} from '../../api/booking-api';
import CustomTable from '../components/table';

export default class Bookings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingTable:{
                rows:[{},{}],           
            }
        }
    }
    
    getBookings = (limit, offset) => {
        getAllBookings(limit, offset)
        .then ( res => {
            //console.log(" in getUsers data =>",res);
            this.setState({
                bookingTable:{
                    rows: res.data.data,          
                }
            })
            
        })
        .catch( err => {
            console.log("Error in getUsers => ",err);
        })
    }

    getNumberOfRows = new Promise( (resolve, reject) => {
        let rows;
        
         getRowsCount()
        .then( res => {
            rows = res.data.data;
            //console.log(" number of rows of moderators => ", rows)
        })
        .catch(error => {
            console.log(error);
        });
        
        setTimeout(() => {
            resolve(rows);
        },100);  
    })

    deleteIt = (id, index) => {
        deleteBooking(id)
        .then( res => {
            const rows = this.state.bookingTable.rows;
            rows[index].status = "deleted";
            //console.log(" hakai  in bookings ", rows);
            this.setState({
                bookingTable:{
                    rows: rows
                }
            })
        })
        .catch( error => {
            console.log(error);
        })
    }
    
    editBookings = (id, data, index) => {
        editBookings(id, data)
        .then( res => {
            const rows = this.state.bookingTable.rows;
            rows[index] = {...data};
            this.setState({
                bookingTable:{
                    rows: rows,
                }
            })
        })
        .catch( error => {
            console.log(error);
        })
    }

    render () {
            const headings= ["Booking Id","Venue Id","Sub Venue Id","Moderator Id","User Id","Amount","Booking Date", "Status","Create Date","Actions"];
            const status=["cancelled","completed","confirmed","deleted"];
        return (
            <React.Fragment>
                <div className="container tableContainer" >
                    <CustomTable getData = {this.getBookings} getRowsCount = {this.getNumberOfRows} provided = "false" edit = {this.editBookings} deleteIt = {this.deleteIt} id = "booking_id" tableHeading = "Bookings" status = {status} headings = {headings} rows = {this.state.bookingTable.rows}/> 
                </div>
            
            </React.Fragment>
          );
    }
}