import React, { useEffect, useState } from 'react';
import styles from './ClearCommunityTasks.css';

const ClearCommunityServiceTasks = () => {
    const [submittedTasks, setSubmittedTasks] = useState([]);
    const [editIndex, setEditIndex] = useState(null); // Track which task is being edited
    const [editTaskName, setEditTaskName] = useState(''); // Track edited task name

    useEffect(() => {
        const tasks = JSON.parse(localStorage.getItem('communityServiceTasks')) || [];
        setSubmittedTasks(tasks);
    }, []);

    const handleClearTask = (index) => {
        const updatedTasks = [...submittedTasks];
        updatedTasks.splice(index, 1);
        localStorage.setItem('communityServiceTasks', JSON.stringify(updatedTasks));
        setSubmittedTasks(updatedTasks);
    };

    const handleEditTask = (index) => {
        setEditIndex(index);
        setEditTaskName(submittedTasks[index].taskName);
    };

    const handleSaveEdit = () => {
        const updatedTasks = [...submittedTasks];
        updatedTasks[editIndex].taskName = editTaskName;
        localStorage.setItem('communityServiceTasks', JSON.stringify(updatedTasks));
        setSubmittedTasks(updatedTasks);
        setEditIndex(null); // Exit edit mode
    };

    return (
        <div className={styles.clearCommunityTasksContainer}>
            <h3 className={styles.clearCommunityTasksHeader}>Clear Submitted Community Service Tasks</h3>
            {submittedTasks.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Task Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submittedTasks.map((task, index) => (
                            <tr key={index}>
                                <td>
                                    {editIndex === index ? (
                                        <input
                                            type="text"
                                            value={editTaskName}
                                            onChange={(e) => setEditTaskName(e.target.value)}
                                        />
                                    ) : (
                                        task.taskName || 'Unnamed Task'
                                    )}
                                </td>
                                <td>
                                    {editIndex === index ? (
                                        <button onClick={handleSaveEdit} className={styles.saveButton}>Save</button>
                                    ) : (
                                        <button onClick={() => handleEditTask(index)} className={styles.editButton}>Edit</button>
                                    )}
                                    <button onClick={() => handleClearTask(index)} className={styles.clearButton}>Clear</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No tasks submitted yet.</p>
            )}
        </div>
    );
};

export default ClearCommunityServiceTasks;
