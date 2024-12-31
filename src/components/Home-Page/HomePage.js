import axios from 'axios';
import { ArcElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import logo from '../../assets/lccbsh-logo.png';
import './HomePage.css';

// Register chart components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const HomePage = () => {
  const [chartData, setChartData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [reportDetails, setReportDetails] = useState({});

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('role');
    const loggedInUsername = localStorage.getItem('username');

    setIsLoggedIn(loggedInStatus);
    setRole(userRole || '');
    setUsername(loggedInUsername || '');

    if (loggedInStatus) {
      const fetchDashboardData = async () => {
        try {
          const communityServiceResponse = await axios.get('/api/community-service');
          const communityServiceTasks = communityServiceResponse.data || [];

          const assignTaskResponse = await axios.get('/api/assign-task');
          const assignTasks = assignTaskResponse.data || [];

          const studentResponse = await axios.get('/api/student-profile'); // Fetch student data
          const studentsCount = studentResponse.data.length; // Count of students

          const taskCounts = {
            assignTasks: assignTasks.length,
            communityServiceTasks: communityServiceTasks.length,
            students: studentsCount, // Use student count directly
          };

          setReportDetails(taskCounts);
          setChartData({
            labels: ['Assigned Tasks', 'Community Service', 'Students'],
            datasets: [
              {
                data: [taskCounts.assignTasks, taskCounts.communityServiceTasks, taskCounts.students],
                backgroundColor: ['#4CAF50', '#FFC107', '#2196F3'],
                hoverOffset: 4,
              },
            ],
          });
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      };

      fetchDashboardData();
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="home-container">
        <h2>Please log in to access the Admin Dashboard</h2>
      </div>
    );
  }

  if (role === 'user') {
    return (
      <div className="home-container">
        <div className="welcome-message">
          <h2>Welcome {username}, To LCC-B SHS Sanction System</h2>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="home-container">
        <h2>Loading Chart Data...</h2>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="pie-chart-container">
        <div className="logo-container">
          <img src={logo} alt="LCCB Logo" className="lccb-logo" />
        </div>
        <div className="welcome-message">
          <h2>Welcome to the Admin Dashboard!</h2>
          <p>You are now logged in.</p>
        </div>
        <div className="chart">
          <Doughnut
            data={chartData}
            options={{
              cutout: '50%',
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }}
          />
        </div>
      </div>

      <div className="report-table">
        <h3>Sanction Reports Summary</h3>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Assigned Tasks</td>
              <td>{reportDetails.assignTasks}</td>
            </tr>
            <tr>
              <td>Community Service</td>
              <td>{reportDetails.communityServiceTasks}</td>
            </tr>
            <tr>
              <td>Students</td>
              <td>{reportDetails.students}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomePage;