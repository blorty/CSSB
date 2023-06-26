import React from 'react';
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
import { AppProvider } from './AppContext'; // import AppProvider

function App() {
  return (
    <AppProvider>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <PrivateRoute path="/user/:id" component={UserProfile} />
          <PrivateRoute path="/strategies" component={StrategyPage} />
          <PrivateRoute path="/team/:id" component={TeamPage} />
        </Switch>
        <Footer />
      </Router>
    </AppProvider>
  );
}

export default App;
