import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './AssignTaskForm.css';

const AssignTaskForm = () => {
    const [studentId, setStudentId] = useState('');
    const [taskId, setTaskId] = useState('');
    const [violation, setViolation] = useState('');
    const [dutyHours, setDutyHours] = useState('');
    const [date, setDate] = useState('');
    const [inTime, setInTime] = useState('');
    const [outTime, setOutTime] = useState('');
    const [personInCharge, setPersonInCharge] = useState('');
    const [status, setStatus] = useState('Pending');
    const [tasks, setTasks] = useState([]);
    const [students, setStudents] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [assignTaskList, setAssignTaskList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [studentSortOrder, setStudentSortOrder] = useState('A-Z');
    const [violationFilter, setViolationFilter] = useState('');

    const userRole = localStorage.getItem('role');

    const fetchData = async () => {
        try {
            const [assignTaskRes, tasksRes, studentsRes, adminsRes] = await Promise.all([
                axios.get('/api/assign-task'),
                axios.get('/api/community-service'),
                axios.get('/api/student-profile'),
                axios.get('/api/get-admins'),
            ]);

            setAssignTaskList(assignTaskRes.data);
            setTasks(tasksRes.data);
            setStudents(studentsRes.data);
            setAdmins(adminsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            NotificationManager.error('Failed to fetch data. Please try again.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatDateString = (dateString) => {
        const date = new Date(dateString);
        return isNaN(date.getTime())
            ? 'Invalid Date'
            : `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

    const formatTimeString = (timeString) => {
        const date = new Date(`1970-01-01T${timeString}`);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${String(minutes).padStart(2, '0')} ${ampm}`;
    };

    const handleSortStudents = (order) => {
        setStudentSortOrder(order);
    };

    const handleViolationFilterChange = (e) => {
        setViolationFilter(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!studentId || !taskId || !violation || !dutyHours || !date || !inTime || !outTime || !personInCharge) {
            NotificationManager.warning('All fields are required. Please fill out the form completely.');
            return;
        }

        const newAssignTask = {
            studentId,
            taskId,
            violation,
            dutyHours: parseInt(dutyHours, 10),
            date: new Date(date).toISOString(),
            inTime: formatTimeString(inTime),
            outTime: formatTimeString(outTime),
            personInCharge,
            status,
        };

        try {
            let response;

            if (isEditing) {
                const taskIdToUpdate = assignTaskList[editIndex]?.id;
                if (!taskIdToUpdate) throw new Error('Task to edit not found.');

                response = await axios.put(`/api/assign-task/${taskIdToUpdate}`, newAssignTask);
            } else {
                response = await axios.post('/api/assign-task', newAssignTask);
            }

            if (response.status === 201 || response.status === 200) {
                handleCancel();
                NotificationManager.success(isEditing ? 'Task updated successfully!' : 'Task added successfully!');
                fetchData();
            } else {
                throw new Error('Unexpected response from server.');
            }
        } catch (error) {
            console.error('Error saving task:', error);
            NotificationManager.error(`Failed to save task: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/assign-task/${id}`);
            setAssignTaskList(assignTaskList.filter(task => task.id !== id));
            NotificationManager.success('Task deleted successfully.');
        } catch (error) {
            console.error('Error deleting task:', error);
            NotificationManager.error('Failed to delete task. Please try again.');
        }
    };

    const handleEdit = (index) => {
        const taskToEdit = assignTaskList[index];
        setStudentId(taskToEdit.studentId);
        setTaskId(taskToEdit.taskId);
        setViolation(taskToEdit.violation);
        setDutyHours(taskToEdit.dutyHours);
        setDate(taskToEdit.date.split('T')[0]);
        setInTime(taskToEdit.inTime);
        setOutTime(taskToEdit.outTime);
        setPersonInCharge(taskToEdit.personInCharge);
        setStatus(taskToEdit.status);
        setShowForm(true);
        setIsEditing(true);
        setEditIndex(index);
    };

    const handleCancel = () => {
        setStudentId('');
        setTaskId('');
        setViolation('');
        setDutyHours('');
        setDate('');
        setInTime('');
        setOutTime('');
        setPersonInCharge('');
        setStatus('Pending');
        setShowForm(false);
        setIsEditing(false);
        setEditIndex(null);
    };

    const filteredAssignTaskList = violationFilter 
        ? assignTaskList.filter(task => task.violation === violationFilter) 
        : assignTaskList;

    const sortedAssignTaskList = [...filteredAssignTaskList].sort((a, b) => {
        const nameA = a.studentName.toLowerCase();
        const nameB = b.studentName.toLowerCase();
        return studentSortOrder === 'A-Z' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    return (
        <div className="assign-task-container">
            <NotificationContainer />
            {!showForm ? (
                <>
                <div className="filter-sort-container">
                    <div className="sort-container">
                        <label>Sort Students: </label>
                        <select value={studentSortOrder} onChange={(e) => handleSortStudents(e.target.value)}>
                            <option value="A-Z">A-Z</option>
                            <option value="Z-A">Z-A</option>
                        </select>
                    </div>
                    {userRole !== 'user' && (
                        <div className="filter-container">
                            <label>Filter by Violation: </label>
                            <select value={violationFilter} onChange={handleViolationFilterChange}>
                                <option value="">All</option>
                                <option value="Cheating">Cheating</option>
                                <option value="Bullying">Bullying</option>
                                <option value="Disruptive Behavior">Disruptive Behavior</option>
                                <option value="Vandalism">Vandalism</option>
                                <option value="Dress Code Violation">Dress Code Violation</option>
                                <option value="Substance Abuse">Substance Abuse</option>
                                <option value="Attendance Issue">Attendance Issue</option>
                                <option value="Harassment">Harassment</option>
                                <option value="Academic Dishonesty">Academic Dishonesty</option>
                            </select>
                        </div>
                    )}
                </div>
                    <button 
                        className="btn add-task-btn" 
                        onClick={() => setShowForm(true)} 
                        style={{ display: userRole === 'user' ? 'none' : 'block' }}>
                        Add Task
                    </button>
                    
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
                                {userRole === 'superAdmin' && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAssignTaskList.map((task, index) => (
                                <tr key={task.id}>
                                <td>{task.studentName}</td>
                                <td>{userRole === 'user' ? 'Private' : task.taskName}</td>
                                <td>{userRole === 'user' ? 'Private' : task.violation}</td>
                                <td>{userRole === 'user' ? 'Private' : task.dutyHours}</td>
                                <td>{userRole === 'user' ? 'Private' : formatDateString(task.date)}</td>
                                <td>{userRole === 'user' ? 'Private' : formatTimeString(task.inTime)}</td>
                                <td>{userRole === 'user' ? 'Private' : formatTimeString(task.outTime)}</td>
                                <td>{task.personInChargeName}</td>
                                <td>{task.status}</td>
                                    {userRole === 'superAdmin' && (
                                        <td>
                                            <button onClick={() => handleEdit(index)}>
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(task.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="task-form">
                    <select value={studentId} onChange={(e) => setStudentId(e.target.value)} required>
                        <option value="">Select Student</option>
                        {students.map(student => (
                            <option key={student.id} value={student.id}>{student.name}</option>
                        ))}
                    </select>

                    <select value={taskId} onChange={(e) => setTaskId(e.target.value)} required>
                        <option value="">Select Task</option>
                        {tasks.map(task => (
                            <option key={task.id} value={task.id}>{task.taskName}</option>
                        ))}
                    </select>

                    <label htmlFor="violation-select">Select Violation:</label>
                    <select
                        id="violation-select"
                        value={violation}
                        onChange={(e) => setViolation(e.target.value)}
                        required
                    >
                        <option value="">--Please choose an option--</option>
                        <option value="Cheating">Cheating</option>
                        <option value="Bullying">Bullying</option>
                        <option value="Disruptive Behavior">Disruptive Behavior</option>
                        <option value="Vandalism">Vandalism</option>
                        <option value="Dress Code Violation">Dress Code Violation</option>
                        <option value="Substance Abuse">Substance Abuse</option>
                        <option value="Attendance Issue">Attendance Issue</option>
                        <option value="Harassment">Harassment</option>
                        <option value="Academic Dishonesty">Academic Dishonesty</option>
                    </select>

                    <input type="number" value={dutyHours} onChange={(e) => setDutyHours(e.target.value)} placeholder="Duty Hours" required />
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    <input type="time" value={inTime} onChange={(e) => setInTime(e.target.value)} required />
                    <input type="time" value={outTime} onChange={(e) => setOutTime(e.target.value)} required />

                    <select value={personInCharge} onChange={(e) => setPersonInCharge(e.target.value)} required>
                        <option value="">Select Person In Charge</option>
                        {admins.filter(admin => admin.role !== 'user').map(admin => (
                            <option key={admin.id} value={admin.id}>{admin.username}</option>
                        ))}
                    </select>

                    <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <div className="form-buttons">
                        <button type="submit" style={{ display: userRole === 'user' ? 'none' : 'inline' }}>Save</button>
                        <button type="button" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AssignTaskForm;