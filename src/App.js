import React, { useState, useEffect } from 'react';
import { Layout } from './components/common';
import Dashboard from './pages/Dashboard';
import { AuthPage } from './pages/auth';
import './App.css';

// PrimeReact CSS imports
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

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
    <div className="App">
      <Layout user={user} onLogout={handleLogout}>
        <Dashboard user={user} />
      </Layout>
    </div>
  );
}

export default App;
