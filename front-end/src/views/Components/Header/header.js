import React from 'react';
import '../../../CSS/Components/header.css';
import NavigationBar from './navBar';
import Carousell from './carousel';
import SearchBar from './searchBar';

class Header extends React.Component{

    render () {

        return (
            <div className = "bg-img">
                <div className = "container">
                    < NavigationBar data = {this.props.navigation}/>
                    < Carousell items = {this.props.carouselItem}/>
                    < SearchBar />
                </div>
            </div> 
        );
    }
}

export default Header;