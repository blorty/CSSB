import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { AppContext } from '../AppContext';
import LoginForm from './LoginForm';

const Login = () => {
    const { isLoggedIn } = useContext(AppContext);

    // If user is already logged in, redirect them to the dashboard
    if (isLoggedIn) {
        return <Redirect to="/dashboard" />;
    }

    return <LoginForm />;
};

export default Login;
