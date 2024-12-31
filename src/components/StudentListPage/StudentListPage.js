import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './StudentListPage.css';

const StudentListPage = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [strandFilter, setStrandFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('A-Z'); // State for sort order
    const [notificationDisplayed, setNotificationDisplayed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const SERVER_URL = 'http://localhost:5000';

    const notify = (type, message) => {
        if (type === 'success') {
            NotificationManager.success(message, 'Success', 3000);
        } else if (type === 'error') {
            NotificationManager.error(message, 'Error', 3000);
        }
    };

    useEffect(() => {
        if (location.state?.notification && !notificationDisplayed) {
            notify('success', location.state.notification);
            setNotificationDisplayed(true);
        }
    }, [location.state, notificationDisplayed]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/api/student-profile`);
                const data = await response.json();

                // Ensure the profile picture path is correctly formatted
                const formattedData = data.map(student => ({
                    ...student,
                    profile_picture: student.profile_picture || '/default-profile.png' // Set a default if not available
                }));

                setStudents(formattedData);
                setFilteredStudents(formattedData); // Initialize filtered students
            } catch (error) {
                console.error("Error fetching students:", error);
                notify('error', 'Failed to fetch students!');
            }
        };

        fetchStudents();
    }, []);

    const handleDeleteStudent = async (id) => {
        try {
            await fetch(`${SERVER_URL}/api/student-profile/${id}`, {
                method: 'DELETE',
            });

            setStudents((prevStudents) => prevStudents.filter((student) => student.id !== id));
            setFilteredStudents((prevStudents) => prevStudents.filter((student) => student.id !== id)); // Update filtered students
            notify('success', 'Student deleted successfully!');
        } catch (error) {
            console.error("Error deleting student:", error);
            notify('error', 'Failed to delete student!');
        }
    };

    const handleEditProfile = (studentId) => {
        navigate(`/student-profile/${studentId}`);
    };

    const handleStrandFilterChange = (e) => {
        const selectedStrand = e.target.value;
        setStrandFilter(selectedStrand);

        // Reset filtered students based on strand
        if (selectedStrand) {
            setFilteredStudents(students.filter(student => student.strand === selectedStrand));
        } else {
            setFilteredStudents(students); // Reset filter
        }
    };

    const handleSortOrderChange = (e) => {
        const selectedOrder = e.target.value;
        setSortOrder(selectedOrder);

        const sortedStudents = [...filteredStudents].sort((a, b) => {
            if (selectedOrder === 'A-Z') {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });

        setFilteredStudents(sortedStudents);
    };

    return (
        <div className="student-list-container">
            <NotificationContainer />
            <div className="student-list-section">
                <h2>Student Profiles</h2>
                <Link to="/student-profile" className="btn btn-success mb-3">
                    Add New Student
                </Link>

                <div className="filter-section mb-3">
                    <label htmlFor="strandFilter">Filter by Strand: </label>
                    <select id="strandFilter" value={strandFilter} onChange={handleStrandFilterChange}>
                        <option value="">All</option>
                        <option value="STEM">STEM</option>
                        <option value="ABM">ABM</option>
                        <option value="HUMSS">HUMSS</option>
                        <option value="GAS">GAS</option>
                        <option value="HE">HE</option>
                        <option value="ICT">ICT</option>
                    </select>

                    <label htmlFor="sortOrder">Sort by Name: </label>
                    <select id="sortOrder" value={sortOrder} onChange={handleSortOrderChange}>
                        <option value="A-Z">A-Z</option>
                        <option value="Z-A">Z-A</option>
                    </select>
                </div>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Profile Picture</th>
                            <th>Name</th>
                            <th>Student ID</th>
                            <th>Track</th>
                            <th>Strand</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <tr key={student.id}>
                                    <td>
                                        <img
                                            src={`${SERVER_URL}${student.profile_picture}`}
                                            alt={`${student.name}'s profile`}
                                            className="profile-img"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/default-profile.png'; // Fallback image
                                            }}
                                        />
                                    </td>
                                    <td>{student.name}</td>
                                    <td>{student.username}</td>
                                    <td>{student.track}</td>
                                    <td>{student.strand}</td>
                                    <td>
                                        <button
                                            onClick={() => handleEditProfile(student.id)}
                                            className="btn btn-warning btn-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm delete-btn"
                                            onClick={() => handleDeleteStudent(student.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No students available. Add a new student to get started!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="student-dashboard-section">
                <h2>Student Dashboard</h2>
                <p>Welcome to the Student Dashboard!</p>
                <ul>
                    <li>Total Students: {students.length}</li>
                    <li>
                        Tracks:{' '}
                        {Array.from(new Set(students.map((student) => student.track))).join(', ') || 'None'}
                    </li>
                    <li>
                        Strands:{' '}
                        {Array.from(new Set(students.map((student) => student.strand))).join(', ') || 'None'}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default StudentListPage;