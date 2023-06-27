import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { AppContext } from '../AppContext';

function NavBar() {
    const { isLoggedIn, logout } = useContext(AppContext);

    const handleLogout = () => {
        logout();
    }

    const LoggedInMenu = (
        <Menu pointing secondary>
        <Menu.Item as={Link} to="/">Home</Menu.Item>
        <Menu.Item as={Link} to="/dashboard">Dashboard</Menu.Item>
        <Menu.Item as={Link} to="/teams">Teams</Menu.Item>
        <Menu.Item as={Link} to="/strategies">Strategies</Menu.Item>
        <Menu.Item as={Link} to="/profile">Profile</Menu.Item>
        <Menu.Item as={Link} to="/notifications">Notifications</Menu.Item>
        <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
        </Menu>
    );

    const NotLoggedInMenu = (
        <Menu pointing secondary>
        <Menu.Item as={Link} to="/">Home</Menu.Item>
        <Menu.Item as={Link} to="/strategies">Strategies</Menu.Item>
        <Menu.Item as={Link} to="/signup">Signup</Menu.Item>
        <Menu.Item as={Link} to="/login">Login</Menu.Item>
        </Menu>
    );

    return (
        <div className="navbar-container" style={{display: 'flex', justifyContent: 'center'}}>
        {isLoggedIn ? LoggedInMenu : NotLoggedInMenu}
        </div>
    );
}

export default NavBar;
