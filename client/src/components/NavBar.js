import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

function NavBar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        <Menu pointing secondary>
            <Menu.Item as={Link} to="/">Home</Menu.Item>
            <Menu.Item as={Link} to="/teams">Teams</Menu.Item>
            <Menu.Item as={Link} to="/strategies">Strategies</Menu.Item>
            <Menu.Item as={Link} to="/profile">Profile</Menu.Item>
            <Menu.Item as={Link} to="/notifications">Notifications</Menu.Item>
            <Menu.Item as={Link} to={isLoggedIn ? "/logout" : "/login"}>{isLoggedIn ? 'Logout' : 'Login'}</Menu.Item>
        </Menu>
    );
}

export default NavBar;
