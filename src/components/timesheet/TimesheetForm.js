import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import './TimesheetForm.css';

const TimesheetForm = ({ timesheet, user, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        periodStartDate: timesheet?.periodStartDate ? new Date(timesheet.periodStartDate) : getMonday(new Date()),
        periodEndDate: timesheet?.periodEndDate ? new Date(timesheet.periodEndDate) : getSunday(new Date()),
        status: timesheet?.status || 'Draft'
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const isEditing = !!timesheet;

    // Helper functions to get week start/end dates
    function getMonday(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    function getSunday(date) {
        const monday = getMonday(date);
        return new Date(monday.getTime() + 6 * 24 * 60 * 60 * 1000);
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => {
            const newData = {
                ...prev,
                [field]: value
            };

            // Auto-calculate week end when start date changes
            if (field === 'periodStartDate' && value) {
                const startDate = new Date(value);
                const endDate = getSunday(startDate);
                newData.periodEndDate = endDate;
            }

            return newData;
        });

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
        if (!formData.periodStartDate) {
            newErrors.periodStartDate = 'Start date is required';
        }

        if (!formData.periodEndDate) {
            newErrors.periodEndDate = 'End date is required';
        }

        // Date validation
        if (formData.periodStartDate && formData.periodEndDate) {
            if (formData.periodStartDate >= formData.periodEndDate) {
                newErrors.periodEndDate = 'End date must be after start date';
            }

            // Check if it's a valid week (7 days)
            const diffTime = Math.abs(formData.periodEndDate - formData.periodStartDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays !== 6) {
                newErrors.periodEndDate = 'Period must be exactly one week (7 days)';
            }

            // Check if start date is Monday
            if (formData.periodStartDate.getDay() !== 1) {
                newErrors.periodStartDate = 'Period must start on Monday';
            }

            // Check if end date is Sunday
            if (formData.periodEndDate.getDay() !== 0) {
                newErrors.periodEndDate = 'Period must end on Sunday';
            }
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
            const timesheetData = {
                ...formData,
                // Convert dates to ISO strings
                periodStartDate: formData.periodStartDate?.toISOString().split('T')[0],
                periodEndDate: formData.periodEndDate?.toISOString().split('T')[0],
                totalHours: 0, // Will be calculated from entries
                submissionDate: null
            };

            await onSave(timesheetData);
        } catch (error) {
            console.error('Error saving timesheet:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save timesheet',
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

    const handleQuickSelectWeek = (weeksOffset = 0) => {
        const today = new Date();
        const targetDate = new Date(today.getTime() + (weeksOffset * 7 * 24 * 60 * 60 * 1000));
        const monday = getMonday(targetDate);
        const sunday = getSunday(targetDate);
        
        setFormData(prev => ({
            ...prev,
            periodStartDate: monday,
            periodEndDate: sunday
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="timesheet-form">
            <Toast ref={toast} />

            {/* Quick Week Selection */}
            {!isEditing && (
                <div className="form-section">
                    <h5>Quick Week Selection</h5>
                    <div className="quick-week-buttons">
                        <Button
                            type="button"
                            label="Previous Week"
                            icon="pi pi-chevron-left"
                            className="p-button-outlined p-button-sm"
                            onClick={() => handleQuickSelectWeek(-1)}
                        />
                        <Button
                            type="button"
                            label="This Week"
                            icon="pi pi-calendar"
                            className="p-button-outlined p-button-sm"
                            onClick={() => handleQuickSelectWeek(0)}
                        />
                        <Button
                            type="button"
                            label="Next Week"
                            icon="pi pi-chevron-right"
                            className="p-button-outlined p-button-sm"
                            onClick={() => handleQuickSelectWeek(1)}
                        />
                    </div>
                </div>
            )}

            <Divider />

            {/* Period Information */}
            <div className="form-section">
                <h5>Timesheet Period</h5>
                <div className="p-fluid grid">
                    <div className="field col-12 md:col-6">
                        <label htmlFor="periodStartDate" className="required">Start Date (Monday)</label>
                        <Calendar
                            id="periodStartDate"
                            value={formData.periodStartDate}
                            onChange={(e) => handleInputChange('periodStartDate', e.value)}
                            className={getFieldClassName('periodStartDate')}
                            showIcon
                            placeholder="Select start date"
                            dateFormat="mm/dd/yy"
                            disabled={isEditing} // Cannot change period for existing timesheets
                        />
                        {renderFieldError('periodStartDate')}
                    </div>

                    <div className="field col-12 md:col-6">
                        <label htmlFor="periodEndDate" className="required">End Date (Sunday)</label>
                        <Calendar
                            id="periodEndDate"
                            value={formData.periodEndDate}
                            onChange={(e) => handleInputChange('periodEndDate', e.value)}
                            className={getFieldClassName('periodEndDate')}
                            showIcon
                            placeholder="Select end date"
                            dateFormat="mm/dd/yy"
                            disabled={isEditing} // Cannot change period for existing timesheets
                        />
                        {renderFieldError('periodEndDate')}
                    </div>
                </div>

                {/* Period Summary */}
                {formData.periodStartDate && formData.periodEndDate && (
                    <div className="period-summary mt-3 p-3 bg-primary-50 border-round">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-info-circle text-primary"></i>
                            <div>
                                <strong>Week Period:</strong>{' '}
                                {formData.periodStartDate.toLocaleDateString()} - {formData.periodEndDate.toLocaleDateString()}
                                <div className="text-sm text-600 mt-1">
                                    {formData.periodStartDate.toLocaleDateString('en-US', { weekday: 'long' })} to{' '}
                                    {formData.periodEndDate.toLocaleDateString('en-US', { weekday: 'long' })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Employee Information (Read-only) */}
            <div className="form-section">
                <h5>Employee Information</h5>
                <div className="p-fluid grid">
                    <div className="field col-12">
                        <label htmlFor="employee">Employee</label>
                        <InputText
                            id="employee"
                            value={`${user.firstName} ${user.lastName} (ID: ${user.employeeId})`}
                            disabled
                            className="bg-gray-50"
                        />
                        <small className="text-500">
                            This timesheet will be created for the logged-in employee
                        </small>
                    </div>
                </div>
            </div>

            {/* Additional Information */}
            {isEditing && (
                <div className="form-section">
                    <h5>Timesheet Information</h5>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <div className="info-item">
                                <label className="info-label">Status</label>
                                <span className="info-value">
                                    <i className={`pi ${timesheet.status === 'Draft' ? 'pi-file-edit' : 
                                                     timesheet.status === 'Submitted' ? 'pi-send' :
                                                     timesheet.status === 'Approved' ? 'pi-check-circle' : 'pi-times-circle'}`}></i>
                                    {timesheet.status}
                                </span>
                            </div>
                        </div>
                        <div className="col-12 md:col-6">
                            <div className="info-item">
                                <label className="info-label">Total Hours</label>
                                <span className="info-value">{timesheet.totalHours || 0} hours</span>
                            </div>
                        </div>
                        {timesheet.submissionDate && (
                            <div className="col-12 md:col-6">
                                <div className="info-item">
                                    <label className="info-label">Submitted On</label>
                                    <span className="info-value">
                                        {new Date(timesheet.submissionDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

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
                    label={isEditing ? 'Update Timesheet' : 'Create Timesheet'}
                    icon={isEditing ? 'pi pi-check' : 'pi pi-plus'}
                    className="p-button-success"
                    loading={loading}
                />
            </div>
        </form>
    );
};

export default TimesheetForm;
