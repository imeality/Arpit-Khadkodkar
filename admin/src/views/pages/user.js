import React from 'react';
 import {getAllUsersWithPagination} from '../../api/users-api';

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
            tableHeading:""
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
                tableHeading:"Users"
            }
        })

    })
    .catch( err => {
        console.log(err);
    })
}

    render () {

        return (
          <div className="container tableContainer" >
            <CustomTable tableHeading = {this.state.userTable.tableHeading} status = {this.state.userTable.status} headings = {this.state.userTable.headings} rows = {this.state.userTable.rows}/>
          </div>
        );
    }
} 