import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ showMenu, handleLogout }) => {
    // Load the username from localStorage on component mount (not used currently)
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            // Logic can be added if username will be used in the future
        }
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                {showMenu && (
                    <div className="navbar-nav-center">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/community-service">Community Service</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/assign-task">Assign Task</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/student-profile">Student Profile</Link>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
