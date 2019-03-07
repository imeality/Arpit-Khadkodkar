import React, {Component} from 'react';


import Header from '../Components/Header/header';

const data = {
    navigation:[
        {
            "name": "Join",
            "link": "/join"
        },
        {
            "name": "List Venue",
            "link": "/listVenue"
        },
        {
            "name": "Login",
            "link": "/loginh"
        }
    ],
    carouselItem:[
        "Find the place you are looking for times.",
        "Search the place which best suits your requirements.",
        "Venues from all over world can be found at this place."
    ]
}

class FirstPage extends Component {


    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render () {

        return(
            <Header  navigation = {data.navigation} carouselItem = {data.carouselItem}/>
        );
    }
}

export default FirstPage;