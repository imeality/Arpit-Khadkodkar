import React, {Component, Fragment} from 'react';

import Footer from '../Components/Footer/footer';
import Header from '../Components/Header/header';

import {Route, Switch} from 'react-router-dom';

import About from './about';
import Login from './login';
import ContactUs from './contactUs';
import Home from './home';
import ListVenue from './listVenue';
import SignUp from './signUp';
import TermsAndPolicy from './termsAndPolicy';
import WhyVenueFinder from './whyVenueFinder';
import WhyWorkWithUs from './whyWorkWithUs';


const header = {
    navigation:[
        {
            "name": "Join",
            "link": "/signUp"
        },
        {
            "name": "List Venue",
            "link": "/listVenue"
        },
        {
            "name": "Login",
            "link": "/login"
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
            "link":"/signUp"
        },
        {
            "value":"Why venue-finder",
            "link":"/whyVenueFinder"
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
            "link":"/whyWorkWithUs"
        },
    ],
    "Venue-Finder":[
        {
            "value":"About",
            "link":"/about"
        },
        {
            "value":"Contact Us",
            "link":"/contactUs"
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
                <Switch>
                    < Route exact path = "/" component = {Home} />
                    < Route path = "/about" component = {About} />
                    < Route path = "/login" component = {Login} />
                    < Route path = "/signUp" component = {SignUp} />
                    < Route path = "/listVenue" component = {ListVenue} />
                    < Route path = "/contactUs" component = {ContactUs} />
                    < Route path = "/termsAndPolicy" component = {TermsAndPolicy} />
                    < Route path = "/whyVenueFinder" component = {WhyVenueFinder} />
                    < Route path = "/whyWorkWithUs" component = {WhyWorkWithUs} />
                    < Route component = {Home} />
                </Switch>
                <Footer blocks = {footer}/>
            </Fragment>    
        );
    }
}

export default FirstPage;