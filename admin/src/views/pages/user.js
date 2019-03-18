import React from 'react';
 import {getAllUsersWithPagination, blockUser, unblockUser, deleteUser, editInfo, editCorporateUser, editIndividualUser} from '../../api/users-api';

import CustomTable from '../components/table';
import Axios from 'axios';

export default class User extends React.Component {   

constructor(props) {
    super(props);
    this.state = {
        userTable:{
            rows:[{},{}],
            headings:[],
            status:[],
            tableHeading:"",
            id:""
        
        }
    }
}

componentDidMount () {
    Axios.defaults.headers.common['authorization'] = "Bearer " + localStorage.getItem('token');
    getAllUsersWithPagination(10,0)
    .then ( res => {
        this.setState({
            userTable:{
                rows: res.data.data,
                headings: ["Id","Name","Email","Password","User Type","Status","SignUp Date", "Last LoggedIn","Actions"],
                status:["active","blocked","deleted"],
                tableHeading:"Users",
                id:"user_id"
            }
        })
      //  console.log(" user data => ", res);
    })
    .catch( err => {
        console.log(err);
    })
}

block( id ) {
    console.log("block of user called");
    var status = "";
    blockUser(id)
    .then( res => {
        status = "success"
    })
    .catch( error => {
        status = "error"
    })

    return status;
}

unblock( id ) {
    console.log("unblock of user called");
    var status = "";
    unblockUser(id)
    .then( res => {
        status = "success"
    })
    .catch( error => {
        status = "error"
    })

    return status;
}

deleteIt(id) {
    var status = "";
    deleteUser(id)
    .then( res => {
        status = "success"
    })
    .catch( error => {
        status = "error"
    })

    return status;  
}

editUser(id, data) {
    var status = "";
    editInfo(id, data)
    .then( res => {
        status = "success"
    })
    .catch( error => {
        status = "error"
    })

    return status;  
}

editIndividualInfo(id, data) {
    var status = "";
    editIndividualUser(id, data)
    .then( res => {
        status = "success"
    })
    .catch( error => {
        status = "error"
    })

    return status;  
}

editCorporateInfo(id, data) {
    var status = "";
    editCorporateUser(id, data)
    .then( res => {
        status = "success"
    })
    .catch( error => {
        status = "error"
    })

    return status;  
}

    render () {

        return (
          <div className="container tableContainer" >
            <CustomTable provided = "true" block = {this.block} unblock = {this.unblock} edit = {this.editUser} deleteIt = {this.deleteIt} id = {this.state.userTable.id} tableHeading = {this.state.userTable.tableHeading} status = {this.state.userTable.status} headings = {this.state.userTable.headings} rows = {this.state.userTable.rows}/>
          </div>
        );
    }
} 