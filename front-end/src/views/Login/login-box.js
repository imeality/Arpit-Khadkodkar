import React, {Component} from 'react';
import {Form, Input, Button} from 'reactstrap';


class LoginBox extends Component {

    render () {

        return (
            <div>
                <h3>{this.props}</h3>
                <Form>
                    < Input type = "email" name = "email" placeholder = "Enter email" />
                    < Input type = "password" name = "password" placeholder = "Enter password" />
                    <Button >Login</Button>
                </Form>
            </div>
        );
    }
    
}

export default LoginBox;