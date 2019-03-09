import React, { Component } from 'react';
import {FormGroup, Label, Input, FormFeedback} from 'reactstrap';
// import classnames from 'classnames';

class InputEmail extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: '',
            validate: {
                emailState: ''
            }
        }
        this.validateEmail = this.validateEmail.bind(this);
    }

    validateEmail(e){
        console.log("in validate email   ", e.target.value);
        const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const { validate } = this.state;
        
      if (emailRex.test(e.target.value)) {
        validate.emailState = 'has-success';
        // console.log(" doing ---  ", this.state.validate.emailState);
        
      } else {
        validate.emailState = 'has-danger';
        // console.log(" doing ---  ", this.state.validate.emailState);

      }
      this.setState({ validate })
    }

    handleChange = async (event) => {
        const { target } = event;
       // console.log(" in handlechange ---  ", target.type, "    ddd   ", target.checked, "   dd   ");

        const value = target.type === 'checkbox' ? target.checked : target.value;
       // console.log("  ---  ", value);

        const { name } = target;
        await this.setState({
          [ name ]: value,
          
        });
      //  console.log("  --- naaa  ---- ", {name});

      }

    render () {
        return(
            <FormGroup>
                <Label>Email</Label>
                <Input 
                    
                    type = "email"
                    name = { this.props.name }
                    id = { this.props.id }
                    value = { this.state.email }
                    onChange={ (e) => {
                        this.validateEmail(e)
                        this.handleChange(e)
                      } 
                    }
                    
                />
               { this.state.validate.emailState === 'has-success'  &&  <h6 className = "text-success">Awesome Email</h6>  }
               { this.state.validate.emailState === 'has-danger'  &&  <h6 className = "text-danger">Incorrect Email</h6>}
               
            </FormGroup>
        );
    }
}
export default InputEmail;



// <FormFeedback className = "text-success">Awesome Email</FormFeedback> 