import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthPage = ({ onAuthSuccess }) => {
    const [currentView, setCurrentView] = useState('login'); // 'login' or 'register'

    const handleSwitchToRegister = () => {
        setCurrentView('register');
    };

    const handleSwitchToLogin = () => {
        setCurrentView('login');
    };

    const handleLoginSuccess = (userData) => {
        if (onAuthSuccess) {
            onAuthSuccess(userData);
        }
    };

    const handleRegisterSuccess = (userData) => {
        // After successful registration, show login page
        setCurrentView('login');
    };

    return (
        <>
            {currentView === 'login' ? (
                <Login
                    onSuccess={handleLoginSuccess}
                    onSwitchToRegister={handleSwitchToRegister}
                />
            ) : (
                <Register
                    onSuccess={handleRegisterSuccess}
                    onSwitchToLogin={handleSwitchToLogin}
                />
            )}
        </>
    );
};

export default AuthPage;
