import React, {Component} from 'react';

import SearchBar from './searchBar';
import TopLeft from './topLeft';
import logo from '../../images/logo.png';

import '../../CSS/First-Page/firstPage.css';

class FirstPage extends Component {
    render () {

        return(
            <div className = "bg-img">
                <div className = "searchBar" >
                    <SearchBar />
                </div>
                <div className = "container">
                    <img className = "img-style" src = {logo}></img>
                    <TopLeft />
                </div>
            </div>
            
        );
    }
}

export default FirstPage;