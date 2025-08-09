import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { employeeService } from '../../services/employeeService';
import './Login.css';

const Login = ({ onSuccess, onSwitchToRegister }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear field error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await employeeService.login(formData.username, formData.password);
            
            toast.current.show({
                severity: 'success',
                summary: 'Login Successful',
                detail: `Welcome back, ${response.employee.firstName}!`,
                life: 3000
            });

            // Store token and user data (in real app, use proper state management)
            if (formData.rememberMe) {
                localStorage.setItem('timetracker_token', response.token);
                localStorage.setItem('timetracker_user', JSON.stringify(response));
            } else {
                sessionStorage.setItem('timetracker_token', response.token);
                sessionStorage.setItem('timetracker_user', JSON.stringify(response));
            }

            // Call success callback
            if (onSuccess) {
                setTimeout(() => onSuccess(response), 1000);
            }

        } catch (error) {
            console.error('Login error:', error);
            
            let errorMessage = 'An error occurred during login. Please try again.';
            
            if (error.status === 401) {
                errorMessage = 'Invalid username or password. Please check your credentials.';
            } else if (error.status === 500) {
                errorMessage = 'Server error. Please try again later.';
            }

            toast.current.show({
                severity: 'error',
                summary: 'Login Failed',
                detail: errorMessage,
                life: 4000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = (role) => {
        const demoUsers = {
            employee: { username: 'john.doe', password: 'password123' },
            manager: { username: 'mike.johnson', password: 'manager123' },
            admin: { username: 'david.brown', password: 'admin123' }
        };

        const demoUser = demoUsers[role];
        setFormData(prev => ({
            ...prev,
            username: demoUser.username,
            password: demoUser.password
        }));

        toast.current.show({
            severity: 'info',
            summary: 'Demo Credentials Loaded',
            detail: `Click "Sign In" to login as ${role}`,
            life: 3000
        });
    };

    return (
        <div className="login-container">
            <Toast ref={toast} />
            
            <Card className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <i className="pi pi-clock text-4xl text-primary"></i>
                    </div>
                    <h2 className="login-title">Welcome Back</h2>
                    <p className="login-subtitle">
                        Sign in to your TimeTracker account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-field">
                        <label htmlFor="username" className="form-label">
                            Username
                        </label>
                        <InputText
                            id="username"
                            value={formData.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            className={classNames({ 'p-invalid': errors.username })}
                            placeholder="Enter your username"
                            autoComplete="username"
                        />
                        {errors.username && (
                            <small className="p-error">{errors.username}</small>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <Password
                            id="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className={classNames({ 'p-invalid': errors.password })}
                            placeholder="Enter your password"
                            feedback={false}
                            toggleMask
                            autoComplete="current-password"
                        />
                        {errors.password && (
                            <small className="p-error">{errors.password}</small>
                        )}
                    </div>

                    <div className="login-options">
                        <div className="remember-me">
                            <Checkbox
                                id="rememberMe"
                                checked={formData.rememberMe}
                                onChange={(e) => handleInputChange('rememberMe', e.checked)}
                            />
                            <label htmlFor="rememberMe" className="remember-label">
                                Remember me
                            </label>
                        </div>

                        <Button
                            label="Forgot Password?"
                            className="p-button-link p-button-plain forgot-password"
                            onClick={() => {
                                toast.current.show({
                                    severity: 'info',
                                    summary: 'Password Reset',
                                    detail: 'Password reset functionality would be implemented here.',
                                    life: 3000
                                });
                            }}
                        />
                    </div>

                    <Button
                        type="submit"
                        label="Sign In"
                        icon="pi pi-sign-in"
                        className="p-button-primary w-full login-button"
                        loading={loading}
                    />

                    <div className="login-footer">
                        <span>Don't have an account?</span>
                        <Button
                            label="Create Account"
                            className="p-button-link p-button-plain"
                            onClick={onSwitchToRegister}
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default Login;
