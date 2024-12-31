import axios from 'axios';
import React, { useState } from 'react';
import { Store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'; // Notification styles
import { useNavigate } from 'react-router-dom';
import AdminNav from '../AdminNav/AdminNav';
import './AdminForm.css';

const AdminLogin = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isCreateAccount, setIsCreateAccount] = useState(false);
    const navigate = useNavigate();

    const notify = (type, message) => {
        Store.addNotification({
            title: type === 'success' ? 'Success' : 'Error',
            message: message,
            type: type, // 'success' or 'danger'
            insert: 'top',
            container: 'top-right',
            animationIn: ['animate__animated', 'animate__fadeIn'],
            animationOut: ['animate__animated', 'animate__fadeOut'],
            dismiss: {
                duration: 3000,
                onScreen: true,
            },
        });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            notify('danger', 'Please enter both username and password');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/admin/login', { username, password });
            const { role, adminId } = response.data;

            // Store user data in localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('adminId', adminId);
            localStorage.setItem('role', role);

            setIsLoggedIn(true);
            setError('');
            notify('success', 'Login successful! Redirecting to homepage...');
            navigate('/'); // Redirect to homepage
        } catch (error) {
            notify('danger', error.response?.data?.error || 'Login failed. Please try again.');
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        if (!username || !newPassword) {
            notify('danger', 'Please enter your username and new password');
            return;
        }

        try {
            await axios.put('http://localhost:5000/api/admin/reset-password', { username, newPassword });
            setError('');
            setIsForgotPassword(false);
            notify('success', 'Password has been reset. Please log in with your new password.');
        } catch (error) {
            notify('danger', error.response?.data?.error || 'Failed to reset password. Please try again.');
        }
    };

    const handleCreateAccountSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password || !confirmPassword) {
            notify('danger', 'Please fill out all fields');
            return;
        }
        if (password !== confirmPassword) {
            notify('danger', 'Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/admin/create', {
                username,
                password,
                role: 'user', // Default role is 'user'
            });
            const { adminId, username: newUser } = response.data;

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('adminId', adminId);
            localStorage.setItem('username', newUser);

            notify('success', 'User account created successfully. Redirecting to homepage...');
            navigate('/');
        } catch (error) {
            notify('danger', error.response?.data?.error || 'Failed to create account. Please try again.');
        }
    };

    return (
        <div className="login-page">
            <AdminNav />
            <div className="login-left"></div>
            <div className="login-right">
                <div className="login-container">
                    <h2>{isForgotPassword ? 'Reset Password' : isCreateAccount ? 'Create Account' : 'Login'}</h2>
                    <form onSubmit={isForgotPassword ? handleForgotPasswordSubmit : isCreateAccount ? handleCreateAccountSubmit : handleLoginSubmit}>
                        <label htmlFor="username">Name:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        {isForgotPassword ? (
                            <>
                                <label htmlFor="new-password">New Password:</label>
                                <input
                                    type="password"
                                    id="new-password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </>
                        ) : isCreateAccount ? (
                            <>
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <label htmlFor="confirm-password">Confirm Password:</label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </>
                        ) : (
                            <>
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </>
                        )}
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit">{isForgotPassword ? 'Reset Password' : isCreateAccount ? 'Create Account' : 'Login'}</button>
                    </form>
                    <button
                        className="reset-password-link"
                        onClick={() => {
                            setIsForgotPassword(false);
                            setIsCreateAccount(!isCreateAccount);
                        }}
                    >
                        {isCreateAccount ? 'Back to Login' : 'Create New Account'}
                    </button>
                    {!isCreateAccount && (
                        <button
                            className="reset-password-link"
                            onClick={() => setIsForgotPassword(!isForgotPassword)}
                        >
                            {isForgotPassword ? 'Back to Login' : 'Forgot Password?'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;