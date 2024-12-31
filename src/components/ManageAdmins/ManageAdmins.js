import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications'; // Import NotificationManager and NotificationContainer
import 'react-notifications/lib/notifications.css'; // Import styles for notifications
import './ManageAdmins.css';

const ManageAdmins = () => {
    const [admins, setAdmins] = useState([]);
    const [role, setRole] = useState('admin');
    const [editingUsername, setEditingUsername] = useState('');
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [fetchError, setFetchError] = useState('');

    // Function to fetch admin data
    const fetchAdmins = async () => {
        try {
            const response = await fetch('/api/get-admins');
            if (!response.ok) {
                throw new Error('Failed to fetch admin accounts.');
            }
            const data = await response.json();
            // Filter to only include 'admin' roles
            const filteredAdmins = data.filter(admin => admin.role === 'admin');
            setAdmins(filteredAdmins);
        } catch (error) {
            console.error('Error fetching admins:', error);
            setFetchError('Unable to load admin accounts. Please try again later.');
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleDeleteAdmin = async (adminUsername) => {
        try {
            const response = await fetch(`/api/delete-admin/${adminUsername}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                setAdmins((prevAdmins) => prevAdmins.filter((admin) => admin.username !== adminUsername));
                setDeletePassword('');
                setDeleteError('');
                NotificationManager.success('Admin account deleted successfully.');
            } else {
                setDeleteError('Failed to delete admin.');
                NotificationManager.error('Failed to delete admin. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting admin:', error);
            setDeleteError('An error occurred while trying to delete the admin.');
            NotificationManager.error('An error occurred while trying to delete the admin.');
        }
    };

    const handleUpdateRole = async (adminUsername) => {
        const adminIndex = admins.findIndex((admin) => admin.username === adminUsername);
        const updatedAdmin = { ...admins[adminIndex], role };

        try {
            const response = await fetch(`/api/update-admin-role/${adminUsername}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role }),
            });

            if (response.ok) {
                const updatedAdmins = [...admins];
                updatedAdmins[adminIndex] = updatedAdmin;
                setAdmins(updatedAdmins);
                localStorage.setItem('admins', JSON.stringify(updatedAdmins));
                setEditingUsername('');
                setRole('admin');
                NotificationManager.success('Role updated successfully.');
            } else {
                NotificationManager.error('Failed to update role.');
            }
        } catch (error) {
            console.error('Error updating role:', error);
            NotificationManager.error('An error occurred while updating the role.');
        }
    };

    return (
        <div className="manage-admins-container">
            <h2>Manage Admin Accounts</h2>
            {fetchError ? (
                <p className="error-message">{fetchError}</p>
            ) : (
                <div className="admin-list">
                    <h3>Admin Accounts</h3>
                    {admins.length === 0 ? (
                        <p className="no-admins-message">No admin accounts available.</p>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map((admin) => (
                                    <tr key={admin.username}>
                                        <td>{admin.username}</td>
                                        <td>{admin.role || 'admin'}</td>
                                        <td>
                                            <div className="delete-section">
                                                <input
                                                    type="password"
                                                    placeholder="Confirm password"
                                                    value={deletePassword}
                                                    onChange={(e) => setDeletePassword(e.target.value)}
                                                />
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteAdmin(admin.username)}
                                                >
                                                    Delete
                                                </button>
                                                {deleteError && <p className="delete-error-message">{deleteError}</p>}
                                            </div>

                                            <select
                                                value={editingUsername === admin.username ? role : admin.role}
                                                onChange={(e) => {
                                                    setEditingUsername(admin.username);
                                                    setRole(e.target.value);
                                                }}
                                            >
                                                <option value="">Change Role</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                            <button
                                                className="update-btn"
                                                onClick={() => handleUpdateRole(admin.username)}
                                            >
                                                Update Role
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
            <NotificationContainer />
        </div>
    );
};

export default ManageAdmins;