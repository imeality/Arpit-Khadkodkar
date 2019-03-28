import React from 'react';

export default class Venue extends React.Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         rows:[{},{}]
    //     }
    // }

    // getVenues = (limit, offset) => {
    //     getAllVenues(limit, offset)
    //     .then ( res => {
    //         //console.log(" in getUsers data =>",res);
    //         this.setState({
    //             rows: res.data.data,          
    //         })
    //     })
    //     .catch( err => {
    //         console.log("Error in getUsers => ",err);
    //     })
    // }

    // getNumberOfRows = new Promise( (resolve, reject) => {
    //     let rows;
        
    //      getRowsCount()
    //     .then( res => {
    //         rows = res.data.data;
    //         //console.log(" number of rows of moderators => ", rows)
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     });
        
    //     setTimeout(() => {
    //         resolve(rows);
    //     },100);  
    // })

    // deleteIt = (id, index) => {
    //     deleteVenue(id)
    //     .then( res => {
    //         const rows = this.state.rows;
    //         rows[index].status = "deleted";
    //         //console.log(" hakai  in bookings ", rows);
    //         this.setState({
    //             rows: rows
    //         })
    //     })
    //     .catch( error => {
    //         console.log(error);
    //     })
    // }

    // editVenue = (id, data, index) => {
    //     editVenue(id, data)
    //     .then( res => {
    //         const rows = this.state.rows;
    //         rows[index] = {...data};
    //         this.setState({
    //             rows: rows,
    //         })
    //     })
    //     .catch( error => {
    //         console.log(error);
    //     })
    // }



    render() {

        // const headings = ["Venue Id","Moderator Id","Venue Name","Image","City","State","Country","Address","Max Capacity", "Status",
        //                     "Ratings","Total Bookings","Featured","Offers","Booking Type", "Actions"], 
        //       status = ["active","halt","deleted","blocked"];

        return(
            // <React.Fragment>
            //     <div className="container tableContainer" >
            //         <CustomTable getData = {this.getEnquiries} getRowsCount = {this.getNumberOfRows} provided = "true" edit = {this.editEnquiry} deleteIt = {this.deleteIt} id = "enquiry_id" tableHeading = "Enquiry" status = {status} headings = {headings} rows = {this.state.rows}/> 
            //     </div>
            // </React.Fragment>
            <h1>Venues</h1>
        );
    }
}