import React from 'react';
import {FormGroup, Label, Input} from 'reactstrap';

function InputPassword(props){
    return(
        <FormGroup>
            <Label>Password</Label>
            <Input 
                type = "password"
                name = {props.name}
                id = {props.id}
            />
        </FormGroup>
    );
}

export default InputPassword;