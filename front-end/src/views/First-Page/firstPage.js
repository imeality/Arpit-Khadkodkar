import React, {Component, Fragment} from 'react';

import Footer from '../Components/Footer/footer';
import Header from '../Components/Header/header';

const header = {
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

const footer = {
    
    "User":[
        {
            "value":"Login",
            "link":"/login"
        },
        {
            "value":"Join",
            "link":"/join"
        },
        {
            "value":"Why venue-finder",
            "link":"/userFAQ"
        },
    ],
    "Venues":[
        {
            "value":"Venue Login",
            "link":"/login"
        },
        {
            "value":"List Venue",
            "link":"/listVenue"
        },
        {
            "value":"Why list with us",
            "link":"/venueFAQ"
        },
    ],
    "Venue-Finder":[
        {
            "value":"About",
            "link":"/about"
        },
        {
            "value":"Contact Us",
            "link":"/contacUs"
        },
        {
            "value":"Terms&Policy",
            "link":"/termsAndPolicy"
        },
    ],
    
}

class FirstPage extends Component {


    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render () {

        return(
            <Fragment>
                <Header  navigation = {header.navigation} carouselItem = {header.carouselItem}/>
                <Footer blocks = {footer}/>
            </Fragment>    
        );
    }
}

export default FirstPage;