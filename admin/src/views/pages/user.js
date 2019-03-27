import React from 'react';
 import {getRowsCount, getAllUsersWithPagination, blockUser, unblockUser, deleteUser, editInfo, editCorporateUser, editIndividualUser} from '../../api/users-api';

import CustomTable from '../components/table';


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
        },
        individualUserTable:{
            rows:[{},{}],
            headings:[],
            status:[],
            tableHeading:"",
            id:""
        },
        corporateUserTable:{
            rows:[{},{}],
            headings:[],
            status:[],
            tableHeading:"",
            id:""
        }
    }
}


 getNumberOfRows = new Promise( (resolve, reject) => {
    let rows;
    
     getRowsCount()
    .then( res => {
        rows = res.data.data;
        console.log(" rows number in user => ", rows)
    })
    .catch(error => {
        console.log(error);
    });
    
    setTimeout(() => {
        resolve(rows);
    },100);  
})

getUsers = (limit, offset) => {
    getAllUsersWithPagination(limit,offset)
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
        
    })
    .catch( err => {
        console.log(err);
    })
}

block = ( id, index ) => {
    console.log("block of user called");
    var status = "";
    blockUser(id)
    .then( res => {
        const rows = this.state.userTable.rows;
        rows[index].status = "blocked";
        this.setState({
            userTable:{
                rows: rows,
                headings: ["Id","Name","Email","Password","User Type","Status","SignUp Date", "Last LoggedIn","Actions"],
                status:["active","blocked","deleted"],
                tableHeading:"Users",
                id:"user_id"
            }
        })
    })
    .catch( error => {
        console.log(error);
    })

    return status;
}

unblock = ( id, index ) => {
    console.log("unblock of user called");

    unblockUser(id)
    .then( res => {
        const rows = this.state.userTable.rows;
        rows[index].status = "active";
        this.setState({
            userTable:{
                rows: rows,
                headings: ["Id","Name","Email","Password","User Type","Status","SignUp Date", "Last LoggedIn","Actions"],
                status:["active","blocked","deleted"],
                tableHeading:"Users",
                id:"user_id"
            }
        })
    })
    .catch( error => {
        console.log(error);
    })

}

deleteIt = (id, index) => {
   
    deleteUser(id)
    .then( res => {
    
        const rows = this.state.userTable.rows;
        rows[index].user_password = "";
        rows[index].status = "deleted";
        //console.log(" hakai  ", rows[index]);
        this.setState({
            userTable:{
                rows: rows,
                headings: ["Id","Name","Email","Password","User Type","Status","SignUp Date", "Last LoggedIn","Actions"],
                status:["active","blocked","deleted"],
                tableHeading:"Users",
                id:"user_id"
            }
        })
    })
    .catch( error => {
        console.log(error);
    })
  
}

editUser = (id, data, index) => {
    
    editInfo(id, data)
    .then( res => {
        const rows = this.state.userTable.rows;
        rows[index] = {...data};
        
        this.setState({
            userTable:{
                rows: rows,
                headings: ["Id","Name","Email","Password","User Type","Status","SignUp Date", "Last LoggedIn","Actions"],
                status:["active","blocked","deleted"],
                tableHeading:"Users",
                id:"user_id"
            }
        })
    })
    .catch( error => {
        console.log(error);
    })

    
}

editIndividualInfo = (id, data, index) => {
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

editCorporateInfo = (id, data, index) => {
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
            <CustomTable getData = {this.getUsers} getRowsCount = {this.getNumberOfRows} provided = "true" block = {this.block} unblock = {this.unblock} edit = {this.editUser} deleteIt = {this.deleteIt} id = {this.state.userTable.id} tableHeading = {this.state.userTable.tableHeading} status = {this.state.userTable.status} headings = {this.state.userTable.headings} rows = {this.state.userTable.rows}/>
            {/* <CustomTable getData = {}/> */}
          </div>
        );
    }
} 