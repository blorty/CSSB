// App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import UserProfile from './components/User_Profile';
import StrategyPage from './components/Strategy_Page';
import TeamPage from './components/Team_Page';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact>
            <Dashboard />
          </Route>
          <Route path="/login">
            <Login setIsLoggedIn={setIsLoggedIn} />
          </Route>
          <Route path="/signup">
            <Signup setIsLoggedIn={setIsLoggedIn} />
          </Route>
          <PrivateRoute path="/user/:id" component={UserProfile} isLoggedIn={isLoggedIn} />
          <PrivateRoute path="/strategy" component={StrategyPage} isLoggedIn={isLoggedIn} />
          <PrivateRoute path="/team/:id" component={TeamPage} isLoggedIn={isLoggedIn} />
        </Switch>
        <Footer />
      </Router>
  );
}

export default App;
