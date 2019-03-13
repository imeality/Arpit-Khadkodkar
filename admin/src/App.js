import React, { Component } from 'react';
import './App.css';

import {Route, Switch} from 'react-router-dom';

import Login from './views/Login/login';
import Admin from './views/admin';


class App extends Component {
  
  render() {
    return (
      <Switch>
        <Route exact path = "/" component = {Login} />
        <Route path = '/admin' component = {Admin} />
      </Switch>
    );
  }
}

export default App;
