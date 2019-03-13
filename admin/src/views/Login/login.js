import React, {Component} from 'react';
import {Form, Container, Button, Input, FormGroup, Label} from 'reactstrap';

// import InputEmail from '../Form/inputEmail';
// import InputPassword from '../Form/inputPassword';

import {login} from '../../api/api';
// import instance from '../../config/axios-config';

import axios from 'axios';

class Login extends Component {

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
        login(this.state.email, this.state.password)
        .then(
            res => {
            
                    var data = res.data.data[0];
                    localStorage.setItem('id', data.id);
                    localStorage.setItem('name', data.user_name);
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('email',data.email); 
                    console.log(" data we get is ", res.status)
                    console.log("token get set", localStorage.getItem('token'));
                 
            }
        )   
        .then( res => {

            // instance.interceptors.request.use( (config) => {
            //     config.headers.Authorization = "Bearer " + localStorage.getItem('token');
            //     return config;
            // },
            // (error) => {
            //     return Promise.reject(error);
            // });
            // axios.defaults.headers.common['authorization'] = "Bearer " + localStorage.getItem('token');
        }) 
        
        .then( res => {
            
            this.props.history.push('/admin')
        })
        .catch( error => {
            if (error.response.status === 401) {
                alert( "email or password is incorrect" );
            } else {
                alert( "internal server error " );
            }
            throw error;
        });
    }
    
    render () {

        return (

            <Container>
                <h3>Login</h3>
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
            </Container>

        );
    }
    
} 

export default Login;