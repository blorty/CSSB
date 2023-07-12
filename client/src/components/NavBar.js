import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AppContext } from '../AppContext';

function NavBar() {
    const { isLoggedIn, logout } = useContext(AppContext);
    const history = useHistory();

    const handleLogout = (history) => {
        logout(history);
    }

    const NavItem = ({ to, children, onClick }) => (
        to
        ? <Link to={to} onClick={onClick} className="text-white font-bold py-2 px-4 rounded transition duration-500 ease-in-out hover:bg-orange-500 hover:text-white transform hover:-translate-y-1 hover:scale-110">
            {children}
            </Link>
        : <button onClick={onClick} className="text-white font-bold py-2 px-4 rounded transition duration-500 ease-in-out hover:bg-orange-500 hover:text-white transform hover:-translate-y-1 hover:scale-110">
            {children}
            </button>
    )
    

    const LoggedInMenu = (
        <nav className="bg-blue-600 p-4 flex justify-around">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/dashboard">Dashboard</NavItem>
            <NavItem to="/teams">Teams</NavItem>
            <NavItem to="/strategies">Strategies</NavItem>
            <NavItem to="/profile">Profile</NavItem>
            <NavItem to="/notifications">Notifications</NavItem>
            <NavItem onClick={() => handleLogout(history)}>Logout</NavItem>
        </nav>
    );

    const NotLoggedInMenu = (
        <nav className="bg-blue-600 p-4 flex justify-around">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/strategies">Strategies</NavItem>
            <NavItem to="/signup">Signup</NavItem>
            <NavItem to="/login">Login</NavItem>
        </nav>
    );

    return (
        <div className="navbar-container">
        {isLoggedIn ? LoggedInMenu : NotLoggedInMenu}
        </div>
    );
}

export default NavBar;
