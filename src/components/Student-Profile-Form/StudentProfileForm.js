import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useNavigate, useParams } from 'react-router-dom';
import './StudentProfileForm.css';

const StudentProfileForm = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [track, setTrack] = useState('');
    const [strand, setStrand] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (!id) {
            // Reset the form for new entries
            setName('');
            setUsername('');
            setTrack('');
            setStrand('');
            setPassword('');
            setConfirmPassword('');
            setProfilePicture(null);
            setIsEditMode(false);
        } else {
            // Load the student profile for editing
            fetch(`http://localhost:5000/api/student-profile/${id}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        NotificationManager.error(data.error, 'Error');
                    } else {
                        setName(data.name);
                        setUsername(data.username);
                        setTrack(data.track);
                        setStrand(data.strand);
                        setProfilePicture(data.profilePicture); // This should only hold the URL/path, not the file
                        setIsEditMode(true);
                    }
                })
                .catch(() => NotificationManager.error('Failed to fetch student profile.', 'Error'));
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validation: Passwords should match
        if (password !== confirmPassword) {
            NotificationManager.error('Passwords do not match.', 'Validation Error');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('username', username);
        formData.append('track', track);
        formData.append('strand', strand);
        formData.append('password', password);
        formData.append('confirmPassword', confirmPassword);
        if (profilePicture) {
            formData.append('profilePicture', profilePicture); // Ensure this is a valid file
        }

        try {
            const response = await fetch(
                isEditMode
                    ? `http://localhost:5000/api/student-profile/${id}`
                    : 'http://localhost:5000/api/student-profile',
                {
                    method: isEditMode ? 'PUT' : 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save profile.');
            }

            const notificationMessage = isEditMode
                ? 'Student profile updated successfully.'
                : 'Student profile created successfully.';

            // Navigate to StudentListPage with notification state
            navigate('/student-list', { state: { notification: notificationMessage } });
        } catch (err) {
            NotificationManager.error(err.message || 'There was an error saving the profile.', 'Error');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file); // Set the file for upload
        }
    };

    return (
        <div className="student-profile-form-container">
            <h3>{isEditMode ? 'Edit Student Profile' : 'Submit Student Profile'}</h3>
            <form className="custom-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    className="custom-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter student's full name"
                    required
                />
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    className="custom-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                />
                <label htmlFor="track">Track:</label>
                <select
                    id="track"
                    className="custom-input"
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    required
                >
                    <option value="">Select Track</option>
                    <option value="Academic">Academic</option>
                    <option value="Technical-Vocational">Technical-Vocational</option>
                    <option value="Sports">Sports</option>
                    <option value="Arts and Design">Arts and Design</option>
                </select>
                <label htmlFor="strand">Strand:</label>
                <select
                    id="strand"
                    className="custom-input"
                    value={strand}
                    onChange={(e) => setStrand(e.target.value)}
                    required
                >
                    <option value="">Select Strand</option>
                    <option value="STEM">STEM</option>
                    <option value="ABM">ABM</option>
                    <option value="HUMSS">HUMSS</option>
                    <option value="GAS">GAS</option>
                    <option value="HE">HE</option>
                    <option value="ICT">ICT</option>
                </select>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    className="custom-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                />
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    className="custom-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    required
                />
                <label htmlFor="profilePicture">Profile Picture:</label>
                <input
                    type="file"
                    id="profilePicture"
                    className="custom-input"
                    onChange={handleFileChange}
                />
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
            <NotificationContainer />
        </div>
    );
};

export default StudentProfileForm;