import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { useRef } from 'react';
import { departmentService } from '../../services/departmentService';
import { employeeService } from '../../services/employeeService';
import './Register.css';

const Register = ({ onSuccess, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        userName: '',
        password: '',
        confirmPassword: '',
        position: '',
        departmentId: '',
        managerId: '',
        roles: ['EMPLOYEE']
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    // Departments and managers from backend
    const [departments, setDepartments] = useState([]);
    const [managers, setManagers] = useState([]);

    useEffect(() => {
        // Fetch departments
        const fetchDepartments = async () => {
            try {
                const response = await departmentService.getDepartments();
                const deptOptions = (response.data || response).map(dept => ({ label: dept.name, value: dept.departmentId }));
                setDepartments(deptOptions);
            } catch (error) {
                console.error('Error loading departments:', error);
            }
        };
        // Fetch managers (all employees for now)
        const fetchManagers = async () => {
            try {
                const response = await employeeService.getAllEmployees();
                // Use full name for label
                const mgrOptions = (Array.isArray(response) ? response : response.employees || response.data || []).map(emp => ({ label: `${emp.firstName} ${emp.lastName}`, value: emp.employeeId }));
                setManagers(mgrOptions);
            } catch (error) {
                console.error('Error loading managers:', error);
            }
        };
        fetchDepartments();
        fetchManagers();
    }, []);

    const roleOptions = [
        { label: 'Employee', value: 'EMPLOYEE' },
        { label: 'Manager', value: 'MANAGER' },
        { label: 'Admin', value: 'ADMIN' }
    ];

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

        // Required field validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.userName.trim()) {
            newErrors.userName = 'Username is required';
        } else if (formData.userName.length < 3) {
            newErrors.userName = 'Username must be at least 3 characters long';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.position.trim()) {
            newErrors.position = 'Position is required';
        }

        if (!formData.departmentId) {
            newErrors.departmentId = 'Please select a department';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.current.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please correct the errors in the form',
                life: 3000
            });
            return;
        }

        setLoading(true);

        try {
            // Format the data for the API
            const registrationData = {
                userName: formData.userName,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                position: formData.position,
                departmentId: formData.departmentId,
                managerId: formData.managerId || null,
                roles: formData.roles
            };

            // Make API call to real endpoint
            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const result = await response.json();

            toast.current.show({
                severity: 'success',
                summary: 'Registration Successful',
                detail: result.message || 'Your account has been created successfully!',
                life: 5000
            });

            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                userName: '',
                password: '',
                confirmPassword: '',
                position: '',
                departmentId: '',
                managerId: '',
                roles: ['EMPLOYEE']
            });

            // Call success callback if provided
            if (onSuccess) {
                setTimeout(() => onSuccess(result), 2000);
            }

        } catch (error) {
            console.error('Registration error:', error);
            
            let errorMessage = 'An error occurred during registration. Please try again.';
            
            if (error.message) {
                errorMessage = error.message;
            }

            toast.current.show({
                severity: 'error',
                summary: 'Registration Failed',
                detail: errorMessage,
                life: 4000
            });
        } finally {
            setLoading(false);
        }
    };

    const passwordHeader = <div className="font-bold mb-3">Pick a password</div>;
    const passwordFooter = (
        <>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 6 characters</li>
            </ul>
        </>
    );

    return (
        <div className="register-container">
            <Toast ref={toast} />
            
            <Card className="register-card">
                <div className="register-header">
                    <div className="register-logo">
                        <i className="pi pi-clock text-4xl text-primary"></i>
                    </div>
                    <h2 className="register-title">Create Account</h2>
                    <p className="register-subtitle">
                        Join TimeTracker to manage your work hours efficiently
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                    {/* Personal Information Section */}
                    <div className="form-section">
                        <h3 className="section-title">Personal Information</h3>
                        
                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="firstName" className="form-label">
                                    First Name *
                                </label>
                                <InputText
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    className={classNames({ 'p-invalid': errors.firstName })}
                                    placeholder="Enter your first name"
                                />
                                {errors.firstName && (
                                    <small className="p-error">{errors.firstName}</small>
                                )}
                            </div>

                            <div className="form-field">
                                <label htmlFor="lastName" className="form-label">
                                    Last Name *
                                </label>
                                <InputText
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    className={classNames({ 'p-invalid': errors.lastName })}
                                    placeholder="Enter your last name"
                                />
                                {errors.lastName && (
                                    <small className="p-error">{errors.lastName}</small>
                                )}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="email" className="form-label">
                                    Email Address *
                                </label>
                                <InputText
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={classNames({ 'p-invalid': errors.email })}
                                    placeholder="your.email@company.com"
                                />
                                {errors.email && (
                                    <small className="p-error">{errors.email}</small>
                                )}
                            </div>

                            <div className="form-field">
                                <label htmlFor="userName" className="form-label">
                                    Username *
                                </label>
                                <InputText
                                    id="userName"
                                    value={formData.userName}
                                    onChange={(e) => handleInputChange('userName', e.target.value)}
                                    className={classNames({ 'p-invalid': errors.userName })}
                                    placeholder="Choose a username"
                                />
                                {errors.userName && (
                                    <small className="p-error">{errors.userName}</small>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Account Information Section */}
                    <div className="form-section">
                        <h3 className="section-title">Account Security</h3>
                        
                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="password" className="form-label">
                                    Password *
                                </label>
                                <Password
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={classNames({ 'p-invalid': errors.password })}
                                    placeholder="Create a strong password"
                                    header={passwordHeader}
                                    footer={passwordFooter}
                                    toggleMask
                                />
                                {errors.password && (
                                    <small className="p-error">{errors.password}</small>
                                )}
                            </div>

                            <div className="form-field">
                                <label htmlFor="confirmPassword" className="form-label">
                                    Confirm Password *
                                </label>
                                <Password
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    className={classNames({ 'p-invalid': errors.confirmPassword })}
                                    placeholder="Confirm your password"
                                    feedback={false}
                                    toggleMask
                                />
                                {errors.confirmPassword && (
                                    <small className="p-error">{errors.confirmPassword}</small>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Work Information Section */}
                    <div className="form-section">
                        <h3 className="section-title">Work Information</h3>
                        
                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="department" className="form-label">
                                    Department *
                                </label>
                                <Dropdown
                                    id="department"
                                    value={formData.departmentId}
                                    options={departments}
                                    onChange={(e) => handleInputChange('departmentId', e.value)}
                                    className={classNames({ 'p-invalid': errors.departmentId })}
                                    placeholder="Select your department"
                                />
                                {errors.departmentId && (
                                    <small className="p-error">{errors.departmentId}</small>
                                )}
                            </div>

                            <div className="form-field">
                                <label htmlFor="position" className="form-label">
                                    Position *
                                </label>
                                <InputText
                                    id="position"
                                    value={formData.position}
                                    onChange={(e) => handleInputChange('position', e.target.value)}
                                    className={classNames({ 'p-invalid': errors.position })}
                                    placeholder="Your job title"
                                />
                                {errors.position && (
                                    <small className="p-error">{errors.position}</small>
                                )}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="manager" className="form-label">
                                    Manager
                                </label>
                                <Dropdown
                                    id="manager"
                                    value={formData.managerId}
                                    options={managers}
                                    onChange={(e) => handleInputChange('managerId', e.value)}
                                    placeholder="Select your manager (optional)"
                                    showClear
                                />
                            </div>
                            <div className="form-field">
                                <label htmlFor="roles" className="form-label">
                                    Roles
                                </label>
                                <MultiSelect
                                    id="roles"
                                    value={formData.roles}
                                    options={roleOptions}
                                    onChange={e => handleInputChange('roles', e.value)}
                                    placeholder="Select roles"
                                    optionLabel="label"
                                    optionValue="value"
                                    className="w-full"
                                    display="chip"
                                />
                            </div>
                        </div>
                    </div>

                    <Divider />

                    <Message 
                        severity="info" 
                        text="Your account will be reviewed and activated by an administrator. You will receive an email notification once approved." 
                        className="w-full mb-4"
                    />

                    <div className="register-actions">
                        <Button
                            type="submit"
                            label="Create Account"
                            icon="pi pi-user-plus"
                            className="p-button-primary w-full"
                            loading={loading}
                        />

                        <div className="register-footer">
                            <span>Already have an account?</span>
                            <Button
                                label="Sign In"
                                className="p-button-link p-button-plain"
                                onClick={onSwitchToLogin}
                            />
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default Register;
