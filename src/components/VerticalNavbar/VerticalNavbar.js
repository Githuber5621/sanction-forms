import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './VerticalNavbar.css';

const VerticalNavbar = ({ onLogout }) => {
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = () => {
            const storedUsername = localStorage.getItem('username');
            const storedRole = localStorage.getItem('role');
            const loggedInStatus = storedUsername && storedRole;

            if (loggedInStatus) {
                setUsername(storedUsername);
                setRole(storedRole);
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus(); // Check login status on component mount
    }, []);

    const fetchAdminData = useCallback(async () => {
        if (!username) return; // Prevent unnecessary API call if username is empty
        try {
            const response = await axios.get('/api/get-admins');
            const admins = response.data;
            const currentUser = admins.find(admin => admin.username === username);

            if (currentUser) {
                setRole(currentUser.role);
            }
        } catch (error) {
            console.error('Error fetching admins:', error);
        }
    }, [username]); // Ensure fetchAdminData updates if username changes

    useEffect(() => {
        if (isLoggedIn && username) {
            fetchAdminData(); // Fetch admin data if logged in
        }
    }, [isLoggedIn, username, fetchAdminData]); // Include fetchAdminData in dependencies

    const handleLogout = () => {
        // Clear user data from local storage
        localStorage.removeItem('username');
        localStorage.removeItem('role');

        // Log the logout action for debugging
        console.log('Logging out...');

        // Reset state
        setUsername('');
        setRole('');
        setIsLoggedIn(false);
        
        // Call the onLogout callback if provided
        if (onLogout) {
            onLogout();
        }
        
        // Redirect to login page
        navigate('/admin-login');
    };

    return (
        <div className="vertical-navbar-container">
            <div className="vertical-sidebar">
                <div className="sidebar-header">
                    <img src={require('../../assets/lccbsh-logo.png')} alt="LCCB Logo" className="logo" />
                    <h4>LCCB Senior High School</h4>
                    {isLoggedIn && username && role && (
                        <span className="admin-name">Admin: {`${username} (${role})`}</span>
                    )}
                </div>
                <ul className="sidebar-nav">
                    {isLoggedIn ? (
                        <>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/assign-task">Assign Task</Link></li>
                            
                            {/* Links visible only to admin and superAdmin roles */}
                            {(role === 'admin' || role === 'superAdmin') && (
                                <>
                                    <li><Link to="/community-service-tasks">Community Service Tasks</Link></li>
                                    <li><Link to="/student-list">Student List</Link></li>
                                </>
                            )}

                            {/* Links visible only to superAdmin */}
                            {role === 'superAdmin' && (
                                <li><Link to="/manage-admins">Manage Admins</Link></li>
                            )}
                            
                            <li>
                                <button onClick={handleLogout} className="nav-button">Logout</button>
                            </li>
                        </>
                    ) : null} {/* No login link displayed when not logged in */}
                </ul>
            </div>
        </div>
    );
};

export default VerticalNavbar;