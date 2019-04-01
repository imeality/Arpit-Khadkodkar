import React from 'react';
import CustomTable from '../components/table';
import {
    getPaymentInfo,getRowsCount,deletePayment,editPayment
} from '../../api/payment-api';

export default class Payment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows:[]
        }
    }

    getPaymentsInfo = (limit, offset) => {
        getPaymentInfo(limit, offset)
        .then ( res => {
            //console.log(" in getUsers data =>",res);
            this.setState({
                rows: res.data.data,          
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
        deletePayment(id)
        .then( res => {
            const rows = this.state.rows;
            rows[index].status = "deleted";
            //console.log(" hakai  in bookings ", rows);
            this.setState({
                rows: rows
            })
        })
        .catch( error => {
            console.log(error);
        })
    }

    editPayment = (id, data, index) => {
        editPayment(id, data)
        .then( res => {
            const rows = this.state.rows;
            rows[index] = {...data};
            this.setState({
                rows: rows,
            })
        })
        .catch( error => {
            console.log(error);
        })
    }

    render() {
        const headings = ["Payment id", "Transaction id", "Booking id", "Moderator id", "Amount", "Bill image", "Date", "Status", "Mode of Payment", "Actions" ], 
              status = ["pending","done","deleted"];

        return (
            <React.Fragment>
                <div className="container tableContainer" >
                    <CustomTable getData = {this.getPaymentsInfo} getRowsCount = {this.getNumberOfRows} provided = "false" edit = {this.editPayment} deleteIt = {this.deleteIt} id = "payment_id" tableHeading = "Payment" status = {status} headings = {headings} rows = {this.state.rows}/> 
                </div>
            </React.Fragment>
        );
    }
}