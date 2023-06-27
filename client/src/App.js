import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AppProvider } from './AppContext';

import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import UserProfile from './components/User_Profile';
import StrategyPage from './components/Strategy_Page';
import TeamPage from './components/Team_Page';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
          <NavBar />
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <PrivateRoute path="/user" component={UserProfile} />
            <PrivateRoute path="/strategies" component={StrategyPage} />
            <PrivateRoute path="/team" component={TeamPage} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
          </Switch>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
