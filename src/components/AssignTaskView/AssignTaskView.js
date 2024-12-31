import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './AssignTaskView.css';

const AssignTaskView = () => {
    const [assignTaskList, setAssignTaskList] = useState([]);
    const [loading, setLoading] = useState(true);  // State to manage loading state
    const [error, setError] = useState(null);      // State to manage errors

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                console.log('Fetching tasks...');
                const response = await axios.get('/api/assign-task');
                console.log('Fetched tasks:', response.data);  // Debugging line to check the structure of the response
                if (response.data && Array.isArray(response.data)) {
                    setAssignTaskList(response.data);
                } else {
                    setError('No tasks available.');
                }
                setLoading(false);  // Set loading to false after data is fetched
            } catch (error) {
                console.error('Error fetching tasks:', error);  // Error logging to console
                setError('Failed to load tasks. Please try again.');
                setLoading(false);  // Set loading to false even if there is an error
            }
        };

        fetchTasks();
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    if (loading) {
        return <div>Loading tasks...</div>; // Loading state message
    }

    if (error) {
        return <div>{error}</div>; // Error message if API fails
    }

    if (assignTaskList.length === 0) {
        return <div>No tasks assigned yet.</div>;  // If no tasks exist, display this message
    }

    return (
        <div className="assign-task-view-container">
            <h2>Assigned Tasks</h2>
            <table className="task-table">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Task</th>
                        <th>Violation</th>
                        <th>Duty Hours</th>
                        <th>Date</th>
                        <th>In Time</th>
                        <th>Out Time</th>
                        <th>Person In Charge</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {assignTaskList.map((task) => (
                        <tr key={task.id}>
                            {/* Ensure task fields match the structure of the response */}
                            <td>{task.studentName || 'Unknown'}</td> {/* Adjust according to API response */}
                            <td>{task.taskName || 'Unknown'}</td>     {/* Adjust according to API response */}
                            <td>{task.violation || 'N/A'}</td>
                            <td>{task.dutyHours || 'N/A'}</td>
                            <td>{task.date || 'N/A'}</td>
                            <td>{task.inTime || 'N/A'}</td>
                            <td>{task.outTime || 'N/A'}</td>
                            <td>{task.personInCharge || 'Unknown'}</td>
                            <td>{task.status || 'Pending'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssignTaskView;
