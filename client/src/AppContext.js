import React, { createContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authError, setAuthError] = useState(null);

    const [strategies, setStrategies] = useState([]);
    const [filteredMap, setFilteredMap] = useState('All');
    
    const [user, setUser] = useState(null);  // Added user state

    const [avatar, setAvatar] = useState(user ? user.avatar : '/default-avatar.jpg');

    const history = useHistory();

    const login = (values, history) => {
        return fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
            credentials: 'include',  // Send cookies
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => Promise.reject(data.message));
            }
            return response.json();
        })
        .then(userData => {
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('user', JSON.stringify(userData));
            setIsLoggedIn(true);
            setUser(userData);
            history.push('/dashboard');
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
    };
    

    const register = (values) => {
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
            credentials: 'include',  // Send cookies
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => Promise.reject(data.message));
            }
            console.log('User signup successful');
            history.push('/dashboard');
        })
        .catch(error => {
            setAuthError(error);
        });
    };

    const logout = (history) => {
        fetch('/logout', {
            method: 'POST',
            credentials: 'include',  // Send cookies
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => Promise.reject(data.message));
            }
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
            setIsLoggedIn(false);
            setUser(null);
            history.push('/');
        })
        .catch(error => {
            console.error('Failed to log out: ', error);
        });
    };

    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        const userData = localStorage.getItem('user');
        setIsLoggedIn(loggedInStatus === 'true');
        setUser(userData ? JSON.parse(userData) : null);  // Restore user data from localStorage
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetch('/strategies', {
                credentials: 'include',  // Send cookies
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => Promise.reject(data.message));
                }
                return response.json();
            })
            .then(data => {
                console.log(data);  // Log the data to the console
                setStrategies(data.strategies);
            })
            .catch(error => {
                console.error('Failed to fetch strategies:', error);
            });
        }
    }, [isLoggedIn]);
    
    const handleMapFilterChange = (value) => {
        setFilteredMap(value);
    }    

    const updateProfile = (name, email) => {
        fetch('/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
            credentials: 'include',
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => Promise.reject(data.message));
            }
            return response.json();
        })
        .then(data => {
            // Handle success
            console.log('Profile updated:', data);
            // Update the user state with the new data
            setUser(data);
            setAvatar(data.avatar);
        })
        .catch(error => {
            console.error('Failed to update profile:', error);
        });
    };
    
    // Include updateProfile and avatar in the context
    return (
        <AppContext.Provider value={{ isLoggedIn, user, avatar, setIsLoggedIn, login, register, logout, authError, strategies, filteredMap, handleMapFilterChange, updateProfile }}>
            {children}
        </AppContext.Provider>
    );
};

