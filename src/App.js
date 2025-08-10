import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/common';
import NotAuthorized from './components/common/NotAuthorized';
import Dashboard from './pages/Dashboard';
import { AuthPage } from './pages/auth';
import { EmployeeManagement } from './components/employee';
import { TimesheetManagement } from './components/timesheet';
import ApprovalManagement from './components/approval/ApprovalManagement';
import { AuthContext } from './context/AuthContext';
import './App.css';
import DepartmentList from './components/department/DepartmentList';
import ProjectList from './components/project/ProjectList';
import ClientList from './components/client/ClientList';

// PrimeReact CSS imports
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// ProtectedRoute component for role-based access
const ProtectedRoute = ({ user, allowedRoles, children }) => {
  const roles = user?.roles || [];
  const hasAccess = allowedRoles.some(role => roles.includes(role));
  return hasAccess ? children : <NotAuthorized />;
};

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        // Check localStorage first (remember me), then sessionStorage
        const storedUser = localStorage.getItem('timetracker_user') || 
                          sessionStorage.getItem('timetracker_user');
        const storedToken = localStorage.getItem('timetracker_token') || 
                           sessionStorage.getItem('timetracker_token');

        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          
          // In a real app, validate the token with the server
          // For mock, we'll just check if it exists and is not expired
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        // Clear corrupted data
        localStorage.removeItem('timetracker_user');
        localStorage.removeItem('timetracker_token');
        sessionStorage.removeItem('timetracker_user');
        sessionStorage.removeItem('timetracker_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    // Clear stored data
    localStorage.removeItem('timetracker_user');
    localStorage.removeItem('timetracker_token');
    sessionStorage.removeItem('timetracker_user');
    sessionStorage.removeItem('timetracker_token');
    
    // Clear user state
    setUser(null);
    
    console.log('User logged out');
  };

  // Show loading spinner while checking for existing session
  if (isLoading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--surface-ground)'
      }}>
        <div className="loading-content" style={{
          textAlign: 'center',
          color: 'var(--text-color)'
        }}>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
          <div>Loading TimeTracker...</div>
        </div>
      </div>
    );
  }

  // Show authentication page if user is not logged in
  if (!user) {
    return (
      <div className="App">
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  // Show main application if user is logged in
  return (
    <AuthContext.Provider value={{ user, setUser, logout: handleLogout }}>
      <Router>
        <div className="App">
          <Layout user={user} onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<ProtectedRoute user={user} allowedRoles={["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_EMPLOYEE"]}><Dashboard user={user} /></ProtectedRoute>} />
              <Route path="/admin/employees" element={<ProtectedRoute user={user} allowedRoles={["ROLE_ADMIN"]}><EmployeeManagement /></ProtectedRoute>} />
              <Route path="/timesheets/*" element={<ProtectedRoute user={user} allowedRoles={["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_EMPLOYEE"]}><TimesheetManagement /></ProtectedRoute>} />
              <Route path="/approvals" element={<ProtectedRoute user={user} allowedRoles={["ROLE_ADMIN", "ROLE_MANAGER"]}><ApprovalManagement user={user} /></ProtectedRoute>} />
              <Route path="/admin/departments" element={<ProtectedRoute user={user} allowedRoles={["ROLE_ADMIN"]}><DepartmentList /></ProtectedRoute>} />
              <Route path="/projects" element={<ProtectedRoute user={user} allowedRoles={["ROLE_ADMIN"]}><ProjectList /></ProtectedRoute>} />
              <Route path="/clients" element={<ProtectedRoute user={user} allowedRoles={["ROLE_ADMIN"]}><ClientList /></ProtectedRoute>} />
              <Route path="/not-authorized" element={<NotAuthorized />} />
              {/* Add more routes as needed */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
