import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Chip } from 'primereact/chip';
import './EmployeeDetail.css';

const EmployeeDetail = ({ employee, departments, onEdit, onClose, canEdit }) => {
    if (!employee) {
        return (
            <div className="flex justify-content-center align-items-center h-20rem">
                <p className="text-500">No employee data available</p>
            </div>
        );
    }

    const getDepartmentName = (departmentId) => {
        const department = departments?.find(d => d.value === departmentId);
        return department?.label || 'Unknown Department';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'Not specified';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatPhone = (phone) => {
        if (!phone) return 'Not provided';
        return phone;
    };

    const getInitials = () => {
        return `${employee.firstName?.charAt(0) || ''}${employee.lastName?.charAt(0) || ''}`;
    };

    const calculateTenure = () => {
        if (!employee.hireDate) return 'Unknown';
        
        const hireDate = new Date(employee.hireDate);
        const today = new Date();
        const diffTime = Math.abs(today - hireDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        
        if (years > 0) {
            return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
        } else {
            return `${months} month${months > 1 ? 's' : ''}`;
        }
    };

    const cardHeader = (
        <div className="employee-detail-header">
            <div className="flex align-items-center gap-3 mb-3">
                <Avatar 
                    label={getInitials()} 
                    size="xlarge" 
                    shape="circle" 
                    className="employee-avatar"
                />
                <div className="flex-1">
                    <h2 className="m-0 text-2xl font-bold text-900">
                        {employee.firstName} {employee.lastName}
                    </h2>
                    <p className="m-0 text-lg text-600 mt-1">{employee.position}</p>
                    <div className="flex align-items-center gap-2 mt-2">
                        <Tag 
                            value={employee.isActive ? 'Active' : 'Inactive'} 
                            severity={employee.isActive ? 'success' : 'danger'}
                        />
                        <Chip 
                            label={getDepartmentName(employee.departmentId)} 
                            className="bg-primary-100 text-primary-900"
                        />
                    </div>
                </div>
                {canEdit && (
                    <Button
                        icon="pi pi-pencil"
                        label="Edit"
                        className="p-button-outlined"
                        onClick={onEdit}
                    />
                )}
            </div>
        </div>
    );

    return (
        <div className="employee-detail">
            <Card header={cardHeader} className="employee-detail-card">
                <div className="grid">
                    {/* Contact Information */}
                    <div className="col-12 md:col-6">
                        <div className="detail-section">
                            <h4 className="text-900 font-semibold mb-3">
                                <i className="pi pi-user mr-2"></i>
                                Contact Information
                            </h4>
                            <div className="field-group">
                                <div className="field-item">
                                    <label className="field-label">Email</label>
                                    <p className="field-value">
                                        <a href={`mailto:${employee.email}`} className="text-primary">
                                            {employee.email}
                                        </a>
                                    </p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Phone</label>
                                    <p className="field-value">
                                        {employee.phone ? (
                                            <a href={`tel:${employee.phone}`} className="text-primary">
                                                {formatPhone(employee.phone)}
                                            </a>
                                        ) : (
                                            <span className="text-500">Not provided</span>
                                        )}
                                    </p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Address</label>
                                    <p className="field-value">
                                        {employee.address || <span className="text-500">Not provided</span>}
                                    </p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Date of Birth</label>
                                    <p className="field-value">{formatDate(employee.dateOfBirth)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Employment Details */}
                    <div className="col-12 md:col-6">
                        <div className="detail-section">
                            <h4 className="text-900 font-semibold mb-3">
                                <i className="pi pi-briefcase mr-2"></i>
                                Employment Details
                            </h4>
                            <div className="field-group">
                                <div className="field-item">
                                    <label className="field-label">Employee ID</label>
                                    <p className="field-value">
                                        <Chip label={employee.employeeId} className="bg-blue-100 text-blue-900" />
                                    </p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Position</label>
                                    <p className="field-value font-semibold">{employee.position}</p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Department</label>
                                    <p className="field-value">{getDepartmentName(employee.departmentId)}</p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Hire Date</label>
                                    <p className="field-value">{formatDate(employee.hireDate)}</p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Tenure</label>
                                    <p className="field-value text-600">{calculateTenure()}</p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Salary</label>
                                    <p className="field-value font-semibold">{formatCurrency(employee.salary)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="col-12 md:col-6">
                        <div className="detail-section">
                            <h4 className="text-900 font-semibold mb-3">
                                <i className="pi pi-phone mr-2"></i>
                                Emergency Contact
                            </h4>
                            <div className="field-group">
                                <div className="field-item">
                                    <label className="field-label">Contact Name</label>
                                    <p className="field-value">
                                        {employee.emergencyContact || <span className="text-500">Not provided</span>}
                                    </p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Contact Phone</label>
                                    <p className="field-value">
                                        {employee.emergencyPhone ? (
                                            <a href={`tel:${employee.emergencyPhone}`} className="text-primary">
                                                {formatPhone(employee.emergencyPhone)}
                                            </a>
                                        ) : (
                                            <span className="text-500">Not provided</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Manager Information */}
                    <div className="col-12 md:col-6">
                        <div className="detail-section">
                            <h4 className="text-900 font-semibold mb-3">
                                <i className="pi pi-users mr-2"></i>
                                Reporting Structure
                            </h4>
                            <div className="field-group">
                                <div className="field-item">
                                    <label className="field-label">Reports To</label>
                                    <p className="field-value">
                                        {employee.managerId ? (
                                            <span>Manager ID: {employee.managerId}</span>
                                        ) : (
                                            <span className="text-500">No direct manager assigned</span>
                                        )}
                                    </p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Status</label>
                                    <p className="field-value">
                                        <Tag 
                                            value={employee.isActive ? 'Active Employee' : 'Inactive Employee'} 
                                            severity={employee.isActive ? 'success' : 'danger'}
                                        />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Notes */}
                    {employee.notes && (
                        <div className="col-12">
                            <Divider />
                            <div className="detail-section">
                                <h4 className="text-900 font-semibold mb-3">
                                    <i className="pi pi-file-edit mr-2"></i>
                                    Additional Notes
                                </h4>
                                <div className="bg-gray-50 p-3 border-round">
                                    <p className="m-0 line-height-3 text-700">{employee.notes}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-content-end gap-2 mt-4 pt-3 border-top-1 surface-border">
                    <Button
                        label="Close"
                        icon="pi pi-times"
                        className="p-button-text"
                        onClick={onClose}
                    />
                    {canEdit && (
                        <Button
                            label="Edit Employee"
                            icon="pi pi-pencil"
                            className="p-button-primary"
                            onClick={onEdit}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default EmployeeDetail;
