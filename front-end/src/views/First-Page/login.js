import React, {Component} from 'react';
import LoginForm from '../Components/Login-Form/loginForm';
import axios from 'axios';
import {Row, Col} from 'reactstrap';

class Login extends Component {

    constructor(props){
        super(props);

        this.state = {
            email:'',
            password:''
        }
        
    }

    handleChange = async (state) => {
        console.log ("   handle chang "  , state.email);
        await this.setState({
            email: state.email,
            password: state.password
        })
       
    }

    userLogin = () => {
        console.log(" yes ==> ", this.state);
        // var formBody = [];
// for (var property in this.state) {
//   var encodedKey = encodeURIComponent(property);
//   var encodedValue = encodeURIComponent(this.state[property]);
//   formBody.push(encodedKey + "=" + encodedValue);
// }
// formBody = formBody.join("&");
        // fetch("http://localhost:5005/users/login", {
        //     method: "POST",
        //     body: {
        //         user_email: this.state.email,
        //         user_password: this.state.password
        //     },
        //     // headers: {
        //     //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        //     // }
        // })
        // .then( res => {
        //     if (res.status == 200) {
        //         console.log(res);
        //        // localStorage.setItem("user_id", )
        //     } else if ( res.status == 401 ) {
        //         console.log("  oopsss   ");
        //     } else {

        //     }
        // })

        axios.post('http://localhost:5005/users/login', {
            user_email: this.state.email,
            user_password: this.state.password
        })
        .then( res => {
            if (res.status == 200) {
                var data = res.data;
                localStorage.setItem('user_id', data.user_id);
                localStorage.setItem('user_type', data.user_type);
                localStorage.setItem('user_name', data.user_name);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user_email',this.state.email); 
                axios.defaults.headers.common['authorization'] = "Bearer " + data.token;
                
            } else if ( res.status == 401 ) {
                
                if (res.data.status == 'not exists') {
                    alert("please check your username or password")
                } else {
                    alert(' you are blocked contact to know more')
                }
            } else {
                alert( "internal server error " );
            }
        })
        .then( this.props.history.push('/user'))
        
    }

    venueLogin () {

    }


    render() {

        return ( 
            <div>
                <LoginForm heading = "User login" onClick = {this.userLogin} setData = {this.handleChange} link = "/signUp"  linkMatter = "Create Account"/>
                {/* <LoginForm heading = "Venue login" onclick = {this.venueLogin} link = "/listVenue" linkMatter = "List Venue"/> */}
            </div>
        );
    }
}

export default Login;