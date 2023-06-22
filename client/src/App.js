// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useState } from 'react';

// Adjust the imports to point to the right location
import Dashboard from './components/Dashboard';
import LoginPage from './components/Login_Register';
import UserProfile from './components/User_Profile';
import StrategyPage from './components/Strategy_Page';
import TeamPage from './components/Team_Page';
import NavBar from './components/NavBar';
import Footer from './components/Footer';


function App() {

  return (
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact>
            <Dashboard />
          </Route>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="/user/:id">
            <UserProfile />
          </Route>
          <Route path="/strategy">
            <StrategyPage />
          </Route>
          <Route path="/team/:id">
            <TeamPage />
          </Route>
        </Switch>
        <Footer />
      </Router>
  );
}

export default App;
