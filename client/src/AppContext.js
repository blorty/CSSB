import React, { createContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const history = useHistory();

// Function to log in a user
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
            console.log('Login successful');
            setIsLoggedIn(true);
            history.push('/dashboard');
        } else {
            // If the server returns an error (response not ok), parse the error message from the response
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        } catch (error) {
        console.log('Error logging in:', error);
        // Throw the error to be caught in the form submission in Login component
        throw error;
        }
    };  

    // Function to register a user
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
            console.log('Registration successful');
            history.push('/dashboard');
        } else {
            console.log('Registration failed');
        }
        } catch (error) {
        console.log('Error registering:', error);
        }
    };

    // Function to log out a user
    const logout = () => {
        // Clear user session here
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        history.push('/login');
    }

    // Check if the user is logged in when the component mounts
    useEffect(() => {
        const checkLoggedIn = () => {
        try {
            const session = localStorage.getItem('user');
            setIsLoggedIn(!!session);
        } catch (error) {
            console.error('Failed to check login status: ', error);
        }
        };
        checkLoggedIn();
    }, []);

    return (
        <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, login, register, logout }}>
        {children}
        </AppContext.Provider>
    );
};
