// NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <nav>
        <ul>
            <li>
            <Link to="/">Home</Link>
            </li>
            <li>
            <Link to="/teams">Teams</Link>
            </li>
            <li>
            <Link to="/strategies">Strategies</Link>
            </li>
            <li>
            <Link to="/profile">Profile</Link>
            </li>
            <li>
            <Link to="/notifications">Notifications</Link>
            </li>
            <li>
            <Link to="/logout">Logout</Link>
            </li>
        </ul>
        </nav>
    );
}

export default NavBar;
