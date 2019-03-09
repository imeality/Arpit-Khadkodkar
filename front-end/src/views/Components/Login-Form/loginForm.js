import React, {Component} from 'react';
import {Form, Container, Button, Input, FormGroup, Label} from 'reactstrap';

// import InputEmail from '../Form/inputEmail';
// import InputPassword from '../Form/inputPassword';

import {Link} from 'react-router-dom';

class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            validEmail : false,
            validPassword: false
        }
        this.validateEmail = this.validateEmail.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        
    }

     validateEmail (event) {

        this.setState({
            email: event.target.value
        });

        const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

       // console.log(" Before set validEmail ===>  ", this.state.validEmail);
        //console.log(" email ===>  ", event.target.value);

        if (emailRex.test(event.target.value)) {
            this.setState({
                validEmail: true
            });
        }else {
            this.setState({
                validEmail: false
            });
        }
      
        //console.log(" After set validEmail ===>  ", this.state.validEmail);
    }

    validatePassword (event) {

        this.setState({
            password: event.target.value
        })

        //console.log("Password  ==>   ", event.target.value);
        //console.log(" Before set validPassword ===>  ", this.state.validPassword);

        if (event.target.value.length >= 8) {
            this.setState({
                validPassword: true
            })
        } else {
            this.setState({
                validPassword: false
            })
        }

        //console.log(" After set validPassword ===>  ", this.state.validPassword);

    }

    validateForm () {
        return this.state.validEmail && this.state.validPassword;
    }
    
    onclick = (event) => {
        event.preventDefault();
        console.log(" on click ==>  ", this.props);
        console.log("====     ", this.state);
        this.props.setData(this.state)
        .then ( this.props.onClick )
    }

    render () {

        return (

            <Container>
                <h3>{this.props.heading}</h3>
                <Form method = "POST">
                    <FormGroup>
                        <Label>Email</Label>
                        <Input type = "email" name = "email" id = "email" value = {this.state.email} onChange = {this.validateEmail} />
                        {this.state.validEmail === true && <h6 className = "text-success">Awesome email !!</h6>}
                        {this.state.validEmail === false && <h6 className = "text-danger" >Incorrect email</h6>}
                    </FormGroup>
                   
                    <FormGroup>
                        <Label>Password</Label>
                        <Input type = "password" name = "password" id = "password" value = {this.state.password} onChange = {this.validatePassword} />
                        {this.state.validPassword === true && <h6 className = "text-success">Password is okay !! </h6>}
                        {this.state.validPassword === false && <h6 className = "text-danger" >Password length must be 8 characters</h6>}
                    </FormGroup>

                    <Button disabled = {!this.validateForm} color = "secondary" type = "submit" onClick = {this.onclick} >Login</Button>
                </Form>
                <Link to = {this.props.link} >{this.props.linkMatter}</Link>
            </Container>

        );
    }
    
} 

export default LoginForm;