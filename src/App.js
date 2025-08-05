import React, { useState } from 'react';
import { Layout } from './components/common';
import Dashboard from './pages/Dashboard';
import './App.css';

// PrimeReact CSS imports
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

function App() {
  // Mock user data - replace with actual authentication
  const [user] = useState({
    employeeId: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    position: 'Software Developer',
    role: {
      roleId: 1,
      roleName: 'Employee',
      permissions: {
        timesheet: {
          view: ['own'],
          create: ['own'],
          edit: ['own'],
          submit: ['own'],
          delete: []
        },
        project: {
          view: ['assigned'],
          create: [],
          edit: [],
          delete: []
        },
        employee: {
          view: [],
          create: [],
          edit: [],
          delete: []
        },
        profile: {
          view: ['own'],
          edit: ['own']
        },
        reports: {
          view: [],
          generate: []
        },
        administration: {
          access: false
        }
      }
    }
  });

  const handleLogout = () => {
    console.log('Logout clicked');
    // Implement logout logic here
  };

  return (
    <div className="App">
      <Layout user={user} onLogout={handleLogout}>
        <Dashboard user={user} />
      </Layout>
    </div>
  );
}

export default App;
