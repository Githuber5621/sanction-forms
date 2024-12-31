import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Store } from 'react-notifications-component'; // Import the Store for notifications
import 'react-notifications-component/dist/theme.css'; // Import notification CSS
import './CommunityServiceTaskList.css';

const CommunityServiceTaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [slots, setSlots] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [taskSortOrder, setTaskSortOrder] = useState('A-Z');

    // Memoize fetchTasks using useCallback
    const fetchTasks = useCallback(async () => {
        try {
            const response = await axios.get('/api/community-service');
            const formattedTasks = response.data.map((task) => ({
                id: task.id,
                taskName: task.taskname || task.taskName,
                slots: task.slots,
            }));
            setTasks(formattedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            notify('danger', 'Failed to fetch tasks!');
        }
    }, []); // No dependencies

    useEffect(() => {
        fetchTasks(); // Call fetchTasks on component mount
    }, [fetchTasks]); // Include fetchTasks in the dependency array

    const handleSubmit = async (e) => {
        e.preventDefault();
        const taskData = { taskName, slots };

        try {
            if (isEditing && editIndex !== null) {
                const taskId = tasks[editIndex].id;
                const response = await axios.put(`/api/community-service/${taskId}`, taskData);
                const updatedTasks = [...tasks];
                updatedTasks[editIndex] = response.data.task;
                setTasks(updatedTasks);
                notify('success', 'Task updated successfully!');
            } else {
                const response = await axios.post('/api/community-service', taskData);
                setTasks([response.data.task, ...tasks]);
                notify('success', 'Task added successfully!');
            }
            resetForm();
        } catch (error) {
            console.error('Error saving task:', error);
            notify('danger', 'Failed to save task!');
        }
    };

    const handleEdit = (index) => {
        const taskToEdit = tasks[index];
        setTaskName(taskToEdit.taskName);
        setSlots(taskToEdit.slots);
        setIsEditing(true);
        setEditIndex(index);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/community-service/${id}`);
            setTasks(tasks.filter((task) => task.id !== id));
            notify('success', 'Task deleted successfully!');
        } catch (error) {
            console.error('Error deleting task:', error);
            notify('danger', 'Failed to delete task!');
        }
    };

    const resetForm = () => {
        setTaskName('');
        setSlots('');
        setIsEditing(false);
        setEditIndex(null);
        setShowForm(false);
    };

    // Notification function
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

    const handleSortChange = (e) => {
        const order = e.target.value;
        setTaskSortOrder(order);

        const sortedTasks = [...tasks].sort((a, b) => {
            if (order === 'A-Z') {
                return a.taskName.localeCompare(b.taskName);
            } else {
                return b.taskName.localeCompare(a.taskName);
            }
        });

        setTasks(sortedTasks);
    };

    return (
        <div className="community-service-task-list">
            <h1>Community Service Tasks</h1>
            <div className="filter-sort-container">
                <label>Sort Task Names: </label>
                <select value={taskSortOrder} onChange={handleSortChange}>
                    <option value="A-Z">A-Z</option>
                    <option value="Z-A">Z-A</option>
                </select>
            </div>
            {!showForm ? (
                <>
                    <button className="btn add-task-btn" onClick={() => setShowForm(true)}>
                        Add Task
                    </button>
                    <table className="task-table">
                        <thead>
                            <tr>
                                <th>Task Name</th>
                                <th>Slots</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task, index) => (
                                <tr key={task.id}>
                                    <td>{task.taskName}</td>
                                    <td>{task.slots}</td>
                                    <td className="button-container">
                                        <button className="btn edit-btn" onClick={() => handleEdit(index)}>
                                            Edit
                                        </button>
                                        <button className="btn delete-btn" onClick={() => handleDelete(task.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="task-form">
                    <div className="form-group">
                        <label htmlFor="taskName">Task Name:</label>
                        <input
                            id="taskName"
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="slots">Slots:</label>
                        <input
                            id="slots"
                            type="number"
                            value={slots}
                            onChange={(e) => setSlots(e.target.value)}
                            required
                        />
                    </div>
                    <div className="button-container">
                        <button type="submit" className="btn save-btn">
                            {isEditing ? 'Save Changes' : 'Add Task'}
                        </button>
                        <button type="button" className="btn cancel-btn" onClick={resetForm}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CommunityServiceTaskList;