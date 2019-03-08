import React, {Component} from 'react';
import LoginBox from './login-box';

class Login extends Component {

    userLogin () {

    }

    venueLogin () {

    }


    render() {

        return (
            <div>
                <LoginBox heading = "User login" onclick = {this.userLogin} link = "/signUp"  linkMatter = "Create Account"/>
                <LoginBox heading = "Venue login" onclick = {this.venueLogin} link = "/listVenue" linkMatter = "List Venue"/>
            </div>
        );
    }
}

export default Login;