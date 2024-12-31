import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AdminForm from './components/Admin-Form/AdminForm';
import AssignTask from './components/Assign-Task-Form/AssignTaskForm';
import AssignTaskView from './components/AssignTaskView/AssignTaskView';
import ClearCommunityTasks from './components/ClearCommunityTasks/ClearCommunityTasks';
import ClearProfileList from './components/ClearProfileList/ClearProfileList';
import CommunityService from './components/Community-Service-Form/CommunityServiceForm';
import CommunityServiceTaskList from './components/CommunityServiceTaskList/CommunityServiceTaskList';
import HomePage from './components/Home-Page/HomePage';
import ManageAdmins from './components/ManageAdmins/ManageAdmins';
import StudentProfileForm from './components/Student-Profile-Form/StudentProfileForm';
import StudentListPage from './components/StudentListPage/StudentListPage';
import VerticalNavbar from './components/VerticalNavbar/VerticalNavbar';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState('user');
    const navigate = useNavigate();
    const location = useLocation();

    // Check login status on initial load
    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
        const storedRole = localStorage.getItem('role') || 'user';
        setIsLoggedIn(loggedInStatus);
        setRole(storedRole);
    }, []);

    // Logout handler
    const handleLogout = () => {
        // Clear user data from local storage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');

        // Reset state
        setIsLoggedIn(false);
        setRole('user'); // Reset role to default
        
        navigate('/admin-login');
    };

    // Protected route component for role-based access
    const ProtectedRoute = ({ element, allowedRoles }) => {
        return isLoggedIn && allowedRoles.includes(role)
            ? element
            : <Navigate to="/admin-login" replace />;
    };

    // Conditionally show the VerticalNavbar if not on /admin-login
    const showNavbar = isLoggedIn && location.pathname !== '/admin-login';

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <ReactNotifications />

            {/* Sidebar visibility logic */}
            {showNavbar && <VerticalNavbar onLogout={handleLogout} />}

            <div
                style={{
                    flex: 1,
                    marginLeft: showNavbar ? '250px' : '0',
                    overflowY: 'auto',
                }}
            >
                <Routes>
                    {/* Public route for admin login */}
                    <Route path="/admin-login" element={<AdminForm setIsLoggedIn={setIsLoggedIn} />} />

                    {/* Default route redirects based on login status */}
                    <Route path="/" element={isLoggedIn ? <HomePage /> : <Navigate to="/admin-login" replace />} />

                    {/* Role-protected routes */}
                    <Route
                        path="/community-service"
                        element={<ProtectedRoute element={<CommunityService />} allowedRoles={['user', 'admin', 'superAdmin']} />}
                    />
                    <Route
                        path="/community-service-tasks"
                        element={<ProtectedRoute element={<CommunityServiceTaskList />} allowedRoles={['user', 'admin', 'superAdmin']} />}
                    />
                    <Route
                        path="/assign-task"
                        element={<ProtectedRoute element={<AssignTask />} allowedRoles={['user', 'admin', 'superAdmin']} />}
                    />
                    <Route
                        path="/view-assign-task"
                        element={<ProtectedRoute element={<AssignTaskView />} allowedRoles={['user']} />}
                    />
                    <Route
                        path="/student-list"
                        element={<ProtectedRoute element={<StudentListPage />} allowedRoles={['user', 'admin', 'superAdmin']} />}
                    />
                    <Route
                        path="/student-profile"
                        element={<ProtectedRoute element={<StudentProfileForm />} allowedRoles={['user', 'admin', 'superAdmin']} />}
                    />
                    <Route
                        path="/student-profile/:id"
                        element={<ProtectedRoute element={<StudentProfileForm />} allowedRoles={['user', 'admin', 'superAdmin']} />}
                    />
                    <Route
                        path="/clear-profile-list"
                        element={<ProtectedRoute element={<ClearProfileList />} allowedRoles={['user', 'admin', 'superAdmin']} />}
                    />
                    <Route
                        path="/clear-community-tasks"
                        element={<ProtectedRoute element={<ClearCommunityTasks />} allowedRoles={['user', 'admin', 'superAdmin']} />}
                    />
                    <Route
                        path="/manage-admins"
                        element={<ProtectedRoute element={<ManageAdmins />} allowedRoles={['user', 'admin', 'superAdmin']} />}
                    />

                    {/* Catch-all route redirects to login */}
                    <Route path="*" element={<Navigate to="/admin-login" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;