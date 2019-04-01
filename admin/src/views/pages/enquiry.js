import React from 'react';

import CustomTable from '../components/table';
import {
    getAllEnquiries,
    getRowsCount,
    editEnquiry,
    deleteEnquiry
} from '../../api/enquiry-api';

export default class Enquiry extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows:[]
        }
    }

    getEnquiries = (limit, offset) => {
        getAllEnquiries(limit, offset)
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
        deleteEnquiry(id)
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

    editEnquiry = (id, data, index) => {
        editEnquiry(id, data)
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
        const headings = ["Enquiry Id","User Id","Venue Id","Subvenue Id","Moderator Id","Enquiry Type", "Status","Event Start Date", "Event End Date",
                            "Event Start Time", "Event End Time", "Budget", "Attendees", "Create Date", "Actions"], 
              status = ["pending","deleted","resolved"];

        return (
            <React.Fragment>
                <div className="container tableContainer" >
                    <CustomTable getData = {this.getEnquiries} getRowsCount = {this.getNumberOfRows} provided = "false" edit = {this.editEnquiry} deleteIt = {this.deleteIt} id = "enquiry_id" tableHeading = "Enquiry" status = {status} headings = {headings} rows = {this.state.rows}/> 
                </div>
            </React.Fragment>
        );
    }
}