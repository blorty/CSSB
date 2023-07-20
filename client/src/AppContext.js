import React, { createContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authError, setAuthError] = useState(null);

    const [strategies, setStrategies] = useState([]);
    const [filteredMap, setFilteredMap] = useState('All');
    
    const [user, setUser] = useState(null);
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
            console.log('User data from server:', userData);  // Log the user data from the server
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('user', JSON.stringify(userData.user));
            setIsLoggedIn(true);
            setUser(userData.user);
            console.log('User state variable:', userData.user);  // Log the value of the user data from the server
            history.push('/dashboard');
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
    };

    const register = (values, history) => {
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
            return response.json();
        })
        .then(userData => {
            console.log('User data from server:', userData);
            console.log('User signup successful');
            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('user', JSON.stringify(userData.user));
            setIsLoggedIn(true);
            setUser(userData.user);
            history.push('/dashboard');
        })
        .catch(error => {
            setAuthError(error);
        });
    };
    
    // Add this useEffect hook to your component
    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        const userData = localStorage.getItem('user');
        setIsLoggedIn(loggedInStatus === 'true');
        if (userData !== "undefined") {
            setUser(JSON.parse(userData));
        }
    }, []);

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
        if (userData !== "undefined") {
            setUser(JSON.parse(userData));
        }
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

    const updateUser = (username, password) => {
        return fetch('/user', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update user profile");
            }
            return response.json();
        })
        .then(data => {
            setUser(data.user);  // Update the user state variable
        })
        .catch(error => console.error('Error:', error));
    };
    

    const createTeam = (teamName) => {  // Remove gameName parameter
        fetch('/team', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: teamName }),  // Remove gameName from the request body
            credentials: 'include',
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => Promise.reject(data.message));
            }
            return response.json();
        })
        .then(data => {
            console.log('Team created:', data);
            // Update your state here if needed
        })
        .catch(error => {
            console.error('Failed to create team:', error);
        });
    };
    

    const updateStrategy = (strategyId, newName, newDescription) => {
        fetch(`/strategy/${strategyId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newName, description: newDescription }),
            credentials: 'include',
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => Promise.reject(data.message));
            }
            return response.json();
        })
        .then(data => {
            console.log('Strategy updated:', data);
            // Update your state here if needed
        })
        .catch(error => {
            console.error('Failed to update strategy:', error);
        });
    };

    const deleteStrategy = (strategyId) => {
        fetch(`/strategy/${strategyId}`, {
            method: 'DELETE',
            credentials: 'include',
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => Promise.reject(data.message));
            }
            return response.json();
        })
        .then(data => {
            console.log('Strategy deleted:', data);
            // Update your state here if needed
        })
        .catch(error => {
            console.error('Failed to delete strategy:', error);
        });
    };
    
    // Include updateProfile and avatar in the context
    return (
        <AppContext.Provider value={{ isLoggedIn, user, avatar, setIsLoggedIn, login, register, logout, authError, strategies, filteredMap, handleMapFilterChange, updateUser, createTeam, updateStrategy, deleteStrategy }}>
            {children}
        </AppContext.Provider>
    );
};
