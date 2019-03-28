import React, {Component} from 'react';
import CustomTable from '../components/table';
import {
    getAllModerators,

    editModerators,
    permitModerator,
    blockModerator,
    deleteModerator,
    
    getModeratorsRowsCount
} from '../../api/moderators-api';

class Moderators extends Component {

    constructor(props) {
        super(props);
        this.state = {
            moderatorTable:{
                rows:[{},{}],
                headings:[],
                status:[],
                tableHeading:"",
                id:""
            }
        }
    }
    
    getUsers = (limit, offset) => {
        getAllModerators(limit, offset)
        .then ( res => {
            //console.log(" in getUsers data =>",res);
            this.setState({
                moderatorTable:{
                    rows: res.data.data,
                    headings: ["Id","Name","Email","Password","Contact number","Status","SignUp Date", "Last LoggedIn","Actions"],
                    status:["confirmed","blocked","deleted","temporary"],
                    tableHeading:"Moderators",
                    id:"moderator_id"
                }
            })
            
        })
        .catch( err => {
            console.log("Error in getUsers => ",err);
        })
    }

    getNumberOfRows = new Promise( (resolve, reject) => {
        let rows;
        
         getModeratorsRowsCount()
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
    
    block = ( id, index ) => {
        console.log("block of moderator called");
        var status = "";
        blockModerator(id)
        .then( res => {
            const rows = this.state.moderatorTable.rows;
            rows[index].status = "blocked";
            this.setState({
                moderatorTable:{
                    rows: rows,
                    headings: ["Id","Name","Email","Password","Contact number","Status","SignUp Date", "Last LoggedIn","Actions"],
                    status:["confirmed","blocked","deleted","temporary"],
                    tableHeading:"Moderators",
                    id:"moderator_id"
                }
            })
        })
        .catch( error => {
            console.log(error);
        })
    
        return status;
    }
    
    unblock = ( id, index ) => {
        console.log("unblock of moderator called");
    
        permitModerator(id)
        .then( res => {
            const rows = this.state.moderatorTable.rows;
            rows[index].status = "confirmed";
            this.setState({
                moderatorTable:{
                    rows: rows,
                    headings: ["Id","Name","Email","Password","Contact number","Status","SignUp Date", "Last LoggedIn","Actions"],
                    status:["confirmed","blocked","deleted","temporary"],
                    tableHeading:"Moderators",
                    id:"moderator_id"
                }
            })
        })
        .catch( error => {
            console.log(error);
        })
    
    }

    deleteIt = (id, index) => {
   
        deleteModerator(id)
        .then( res => {
        
            const rows = this.state.moderatorTable.rows;
            rows[index].password = "";
            rows[index].status = "deleted";
            //console.log(" hakai  ", rows[index]);
            this.setState({
                moderatorTable:{
                    rows: rows,
                    headings: ["Id","Name","Email","Password","Contact number","Status","SignUp Date", "Last LoggedIn","Actions"],
                    status:["confirmed","blocked","deleted","temporary"],
                    tableHeading:"Moderators",
                    id:"moderator_id"
                }
            })
        })
        .catch( error => {
            console.log(error);
        })
      
    }
    
    editUser = (id, data, index) => {
    
        editModerators(id, data)
        .then( res => {
            const rows = this.state.moderatorTable.rows;
            rows[index] = {...data};
            
            this.setState({
                userTable:{
                    rows: rows,
                    headings: ["Id","Name","Email","Password","Contact number","Status","SignUp Date", "Last LoggedIn","Actions"],
                    status:["confirmed","blocked","deleted","temporary"],
                    tableHeading:"Moderators",
                    id:"moderator_id"
                }
            })
        })
        .catch( error => {
            console.log(error);
        })
    
        
    }

    render () {

        return (
            <React.Fragment>
                <div className="container tableContainer" >
                    <CustomTable getData = {this.getUsers} getRowsCount = {this.getNumberOfRows} provided = "true" block = {this.block} unblock = {this.unblock} edit = {this.editUser} deleteIt = {this.deleteIt} id = {this.state.moderatorTable.id} tableHeading = {this.state.moderatorTable.tableHeading} status = {this.state.moderatorTable.status} headings = {this.state.moderatorTable.headings} rows = {this.state.moderatorTable.rows}/> 
                </div>
            
            </React.Fragment>
          );
    }
}

export default Moderators;