import React from 'react';
import CustomTable from '../components/table';
import {getAllVenues, getRowsCount, deleteVenue, editVenue, blockVenue, unBlockVenue} from '../../api/venue-api';

const allFacilities = ["gym","bar","restaurant","parking","wifi","disabled_facility","bedroom","laundry","av_technician"];


export default class Venue extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows:[]
        }
    }
    
    getVenues = (limit, offset) => {
        getAllVenues(limit, offset)
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
        deleteVenue(id)
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

    editVenue = (id, row, index) => {
       
        let charArr = row.facilities.split(", ");
        let facilities = {};
        let len = allFacilities.length;
        let fLen = charArr.length;

        let layouts = {};
        let layoutArr = row.roomLayouts.split(", ");
        let layoutsLength = layoutArr.length;

        let types = {};
        let typesArr = row.venueTypes.split(", ");
        let typesLength = typesArr.length;

        

        for( let i=0;i<len;i++) {
            let index = charArr.indexOf(allFacilities[i]);
            if(index >= 0) {
                facilities[allFacilities[i]] = 1;
                charArr[index] = "";
            } else {
                facilities[allFacilities[i]] = 0;
            }
        }
        let fOthers = "";
        for(let i=0; i<fLen; i++) {
            if(charArr[i] !== "") {
                fOthers += charArr[i] + ", ";
            }
        }
        fOthers = fOthers.slice(0, fOthers.length-2);
        facilities["others"] = fOthers;
        console.log(" facility in editVenue ",facilities["others"]);
        for(let i=0;i<layoutsLength;i++) {
            let tempArr = layoutArr[i].split(" = ");
            layouts[tempArr[i]] = tempArr[1];
        }

        for(let i=0;i<typesLength;i++) {
            types[typesArr[i]] = 1;
        }
        console.log(" facility in edivenue ",typesLength);
        let data = {
            venues:{
                venue_id: row.venueid,
                moderator_id: row.moderator_id,
                venue_name: row.venue_name,
                image: row.image,
                city: row.city,
                state: row.state,
                country: row.country,
                address: row.address,
                max_capacity: row.max_capacity,
                status: row.status,
                ratings: row.ratings,
                total_bookings: row.total_bookings,
                featured: row.featured,
                offers: row.offers,
                booking_type: row.booking_type
            },
            facilities: facilities,
            layouts: layouts,
            types: types
        }
        console.log(" edit venue  data in venues ",data);
        editVenue(id, data)
        .then( res => {
            const rows = this.state.rows;
            rows[index] = {...row};
            this.setState({
                rows: rows,
            })
        })
        .catch( error => {
            console.log(error);
        })
    }

    block = ( id, index ) => {
        console.log("block of venue called");
        var status = "";
        blockVenue(id)
        .then( res => {
            const rows = this.state.rows;
            rows[index].status = "blocked";
            this.setState({
                rows: rows, 
            })
        })
        .catch( error => {
            console.log(error);
        })
    
        return status;
    }

    unblock = ( id, index ) => {
        console.log("unblock of venue called");
    
        unBlockVenue(id)
        .then( res => {
            const rows = this.state.rows;
            rows[index].status = "active";
            this.setState({
                rows: rows,
            })
        })
        .catch( error => {
            console.log(error);
        })
    
    }

    render() {

        const headings = ["Venue Id","Moderator Id","Venue Name","Image","City","State","Country","Address","Max Capacity", "Status",
                            "Ratings","Total Bookings","Featured","Offers","Booking Type","Facilities","Room Layouts", "Venue Types", "Actions"], 
              status = ["active","halt","deleted","blocked"];

        return(
            <React.Fragment>
                <div className="container tableContainer" >
                    <CustomTable getData = {this.getVenues} block = {this.block} unblock = {this.unblock} getRowsCount = {this.getNumberOfRows} provided = "true" edit = {this.editVenue} deleteIt = {this.deleteIt} id = "venue_id" tableHeading = "Venues" status = {status} headings = {headings} rows = {this.state.rows}/> 
                </div>
            </React.Fragment>
            
        );
    }
}