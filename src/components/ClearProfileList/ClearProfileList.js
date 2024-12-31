import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClearProfileList = () => {
    const [studentList, setStudentList] = useState([]);
    const navigate = useNavigate();  // For navigation

    // Fetch the student list from localStorage when the component mounts
    useEffect(() => {
        const savedStudents = JSON.parse(localStorage.getItem('studentList')) || [];
        console.log(savedStudents);  // Log to ensure the data is correctly fetched
        setStudentList(savedStudents);
    }, []);

    // Function to remove a selected profile
    const handleClearProfile = (index) => {
        const updatedList = studentList.filter((_, i) => i !== index);
        localStorage.setItem('studentList', JSON.stringify(updatedList)); // Save the updated list back to localStorage
        setStudentList(updatedList); // Update the state to reflect the changes
    };

    // Function to navigate to the StudentProfileForm with the selected student for editing
    const handleEditProfile = (student) => {
        navigate('/student-profile', { state: { student } });
    };

    return (
        <div className="container mt-4">
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Profile Picture</th> {/* New column for profile picture */}
                        <th>Username</th>
                        <th>Name</th>
                        <th>Track</th>
                        <th>Strand</th>
                        <th>Actions</th> {/* Added an Actions column */}
                    </tr>
                </thead>
                <tbody>
                    {studentList.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center">No profiles available.</td>
                        </tr>
                    ) : (
                        studentList.map((student, index) => (
                            <tr key={index}>
                                <td>
                                    {/* Display profile picture */}
                                    {student.profilePicture ? (
                                        <img
                                            src={student.profilePicture} // Ensure the path is correct
                                            alt="Profile"
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                borderRadius: '50%',
                                                objectFit: 'cover', // To avoid image distortion
                                            }}
                                        />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </td>
                                <td>{student.username}</td>  {/* Display username */}
                                <td>{student.name}</td>
                                <td>{student.track}</td>
                                <td>{student.strand}</td>
                                <td>
                                    <button
                                        onClick={() => handleClearProfile(index)} // Call the clear function for this profile
                                        className="btn btn-danger btn-sm"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        onClick={() => handleEditProfile(student)} // Call edit function for this profile
                                        className="btn btn-warning btn-sm ml-2"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ClearProfileList;
