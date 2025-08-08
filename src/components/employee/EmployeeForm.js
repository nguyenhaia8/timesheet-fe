import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import './EmployeeForm.css';

const EmployeeForm = ({ employee, departments, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        firstName: employee?.firstName || '',
        lastName: employee?.lastName || '',
        email: employee?.email || '',
        position: employee?.position || '',
        departmentId: employee?.departmentId || null
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const isEditing = !!employee;

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!formData.firstName?.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName?.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email?.trim()) {
            newErrors.email = 'Email is required';
        } else {
            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        if (!formData.position?.trim()) {
            newErrors.position = 'Position is required';
        }

        if (!formData.departmentId) {
            newErrors.departmentId = 'Department is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please correct the errors in the form',
                life: 3000
            });
            return;
        }

        setLoading(true);

        try {
            const employeeData = {
                ...formData
            };

            await onSave(employeeData);
        } catch (error) {
            console.error('Error saving employee:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save employee',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const getFieldClassName = (fieldName) => {
        return classNames({
            'p-invalid': errors[fieldName]
        });
    };

    const renderFieldError = (fieldName) => {
        return errors[fieldName] && (
            <small className="p-error block">{errors[fieldName]}</small>
        );
    };

    return (
        <form onSubmit={handleSubmit} className="employee-form">
            <Toast ref={toast} />

            <div className="p-fluid grid">
                <div className="field col-12 md:col-6">
                    <label htmlFor="firstName" className="required">First Name</label>
                    <InputText
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={getFieldClassName('firstName')}
                        placeholder="Enter first name"
                    />
                    {renderFieldError('firstName')}
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="lastName" className="required">Last Name</label>
                    <InputText
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={getFieldClassName('lastName')}
                        placeholder="Enter last name"
                    />
                    {renderFieldError('lastName')}
                </div>

                <div className="field col-12">
                    <label htmlFor="email" className="required">Email</label>
                    <InputText
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={getFieldClassName('email')}
                        placeholder="Enter email address"
                    />
                    {renderFieldError('email')}
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="position" className="required">Position</label>
                    <InputText
                        id="position"
                        value={formData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        className={getFieldClassName('position')}
                        placeholder="Enter job position"
                    />
                    {renderFieldError('position')}
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="departmentId" className="required">Department</label>
                    <Dropdown
                        id="departmentId"
                        value={formData.departmentId}
                        options={departments}
                        onChange={(e) => handleInputChange('departmentId', e.value)}
                        className={getFieldClassName('departmentId')}
                        placeholder="Select department..."
                        filter
                    />
                    {renderFieldError('departmentId')}
                </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions flex justify-content-end gap-2 mt-4">
                <Button
                    type="button"
                    label="Cancel"
                    icon="pi pi-times"
                    className="p-button-text"
                    onClick={onCancel}
                    disabled={loading}
                />
                <Button
                    type="submit"
                    label={isEditing ? 'Update Employee' : 'Create Employee'}
                    icon={isEditing ? 'pi pi-check' : 'pi pi-plus'}
                    className="p-button-success"
                    loading={loading}
                />
            </div>
        </form>
    );
};

export default EmployeeForm;
