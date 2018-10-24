import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import login from './components/auth/Login';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path='/' component = { Landing } />
          <div className= "container">
            <Router exact path='/register' component = { Register } />
            <Router exact path='/login' component = { login } />
          </div>
        </div>
      </Router>


    );
  }
}

export default App;
