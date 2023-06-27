import React, { createContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authError, setAuthError] = useState('');
    const history = useHistory();

    const login = async (values) => {
        try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        if (response.ok) {
            localStorage.setItem('isLoggedIn', true);
            setIsLoggedIn(true);
            history.push('/dashboard');
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        } catch (error) {
        throw error;
        }
    };

    const register = async (values) => {
        try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        if (response.ok) {
            history.push('/dashboard');
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        } catch (error) {
        setAuthError(error.message);
        }
    };

    const logout = async () => {
        try {
        const response = await fetch('/logout', {
            method: 'GET',
        });

        if (response.ok) {
            localStorage.removeItem('isLoggedIn');
            setIsLoggedIn(false);
            history.push('/');
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        } catch (error) {
        console.error('Failed to log out: ', error);
        }
    };

    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(loggedInStatus === 'true');
    }, []);

    return (
        <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, login, register, logout, authError }}>
        {children}
        </AppContext.Provider>
    );
};
