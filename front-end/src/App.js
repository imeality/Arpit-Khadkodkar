import React, { Component } from 'react';

import './App.css';

import FirstPage from './views/First-Page/firstPage';
import User from './views/User/user';
import Login from './views/First-Page/login';

import withAuth from './utilities/withAuth';

import {Route, Switch} from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <Switch>
        < Route exact path = "/" component = {FirstPage} />
        < Route path = "/login" component = {Login} />
       < Route path = "/user" component = {withAuth(User)} />
        {/*  < Route path = "/moderator/:moderator_id" component = {About} />
        < Route path = "/admin/:admin_id" component = {Admin} /> */}
        < Route component = {FirstPage} />
      </Switch>
    );
  }
}

export default App;
