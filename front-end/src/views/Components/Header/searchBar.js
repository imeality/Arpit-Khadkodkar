import React, {Component} from 'react';
import {Form, Button, Input} from 'reactstrap';

import '../../../CSS/Components/Header/header.css';

class SearchBar extends Component{
    
    render () {

        return(
            <div className="centreSearch">
            <Form>
                <Input 
                    type = "text"
                    placeholder = "Enter City"
                    name = "city"
                    id = "city" 
                    className = "formElement mrB"
                    required
                />
                <Input 
                    type = "text"
                    placeholder = "Number Of People"
                    name = "numOfPeople"
                    id = "numOfPeople"
                    className = "formElement mrB"
                    required 
                />
                <Button className = "formElement">
                    Search
                </Button>
            </Form>
            </div>
        );
    }
}

export default SearchBar;