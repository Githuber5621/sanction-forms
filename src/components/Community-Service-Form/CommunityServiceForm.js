import React, { useState } from 'react';
import './CommunityServiceForm.css';

const CommunityServiceForm = () => {
    const [taskName, setTaskName] = useState('');
    const [slots, setSlots] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const newTask = { taskName, slots };
    
        try {
            // Save task in the community service database
            const response = await fetch('http://localhost:5000/api/community-service', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert('Community service task created successfully.');
    
                // Save task to localStorage or global state for AssignTaskForm access
                const existingTasks = JSON.parse(localStorage.getItem('communityServiceTasks')) || [];
                existingTasks.push(data.task);  // Use data.task to store task with its ID
                localStorage.setItem('communityServiceTasks', JSON.stringify(existingTasks));
    
                // Automatically update AssignTask database (this part may need adjustment)
                const assignTaskResponse = await fetch('http://localhost:5000/api/assign-task', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ task_id: data.task.id, slots }),
                });
    
                if (assignTaskResponse.ok) {
                    console.log('Task also registered in AssignTask.');
                } else {
                    console.error('Error registering task in AssignTask.');
                }
            } else {
                alert(`Error: ${data.message}`);
            }
    
            // Reset form fields
            setTaskName('');
            setSlots('');
        } catch (err) {
            console.error('Error saving task:', err);
            alert('There was an error saving the task.');
        }
    };
    

    const handleClearList = () => {
        // Clear tasks from localStorage
        localStorage.removeItem('communityServiceTasks');
        alert('Community service task list has been cleared.');
    };

    return (
        <div className="community-service-form-container">
            <h3>Submit Community Service Task</h3>
            <form className="custom-form" onSubmit={handleSubmit}>
                <label htmlFor="taskname">Task Name:</label>
                <input
                    type="text"
                    id="taskname"
                    className="custom-input"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Enter task name"
                    required
                />
                <label htmlFor="slots">Slots:</label>
                <input
                    type="number"
                    id="slots"
                    className="custom-input"
                    value={slots}
                    onChange={(e) => setSlots(e.target.value)}
                    placeholder="Enter number of slots"
                    required
                />
                <div className="button-group">
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                    <button type="button" className="btn btn-danger" onClick={handleClearList}>
                        Clear All Task List
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommunityServiceForm;
