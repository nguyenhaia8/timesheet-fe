import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { Divider } from 'primereact/divider';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chip } from 'primereact/chip';
import { timesheetService } from '../../services/timesheetService';
import './TimesheetDetail.css';

const TimesheetDetail = ({ timesheet, user, onEdit, onSubmit, onClose, permissions }) => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (timesheet) {
            loadTimesheetEntries();
        }
    }, [timesheet]);

    const loadTimesheetEntries = async () => {
        if (!timesheet) return;
        
        try {
            setLoading(true);
            const response = await timesheetService.getTimesheetEntries(timesheet.timesheetId);
            setEntries(response.data || response || []);
        } catch (error) {
            console.error('Error loading timesheet entries:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!timesheet) {
        return (
            <div className="flex justify-content-center align-items-center h-20rem">
                <p className="text-500">No timesheet data available</p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusSeverity = (status) => {
        switch (status) {
            case 'Draft': return 'info';
            case 'Submitted': return 'warning';
            case 'Approved': return 'success';
            case 'Rejected': return 'danger';
            default: return 'info';
        }
    };

    const calculateWeekDays = () => {
        const start = new Date(timesheet.periodStartDate);
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const getHoursForDay = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        const dayEntries = entries.filter(entry => entry.date === dateStr);
        return dayEntries.reduce((total, entry) => total + (entry.hoursWorked || 0), 0);
    };

    // Column templates for entries table
    const dateBodyTemplate = (rowData) => {
        const date = new Date(rowData.date);
        return (
            <div>
                <div className="font-medium">{date.toLocaleDateString()}</div>
                <div className="text-sm text-500">{date.toLocaleDateString('en-US', { weekday: 'long' })}</div>
            </div>
        );
    };

    const projectBodyTemplate = (rowData) => {
        return (
            <Chip 
                label={`Project ${rowData.projectId}`} 
                className="bg-primary-100 text-primary-900"
            />
        );
    };

    const hoursBodyTemplate = (rowData) => {
        return (
            <Badge 
                value={`${rowData.hoursWorked}h`} 
                severity="info"
            />
        );
    };

    const taskBodyTemplate = (rowData) => {
        return (
            <div className="max-w-20rem">
                {rowData.taskDescription}
            </div>
        );
    };

    const cardHeader = (
        <div className="timesheet-detail-header">
            <div className="flex align-items-center justify-content-between mb-3">
                <div className="flex-1">
                    <h2 className="m-0 text-2xl font-bold text-900">
                        Timesheet Details
                    </h2>
                    <p className="m-0 text-lg text-600 mt-1">
                        {formatDate(timesheet.periodStartDate)} - {formatDate(timesheet.periodEndDate)}
                    </p>
                    <div className="flex align-items-center gap-2 mt-2">
                        <Tag 
                            value={timesheet.status} 
                            severity={getStatusSeverity(timesheet.status)}
                        />
                        <Badge 
                            value={`${timesheet.totalHours || 0} hours`} 
                            severity={timesheet.totalHours >= 40 ? 'success' : 'warning'}
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    {permissions.canEditTimesheet() && timesheet.status === 'Draft' && (
                        <Button
                            icon="pi pi-pencil"
                            label="Edit"
                            className="p-button-outlined"
                            onClick={onEdit}
                        />
                    )}
                    {permissions.canSubmitTimesheet() && timesheet.status === 'Draft' && (
                        <Button
                            icon="pi pi-send"
                            label="Submit"
                            className="p-button-warning"
                            onClick={onSubmit}
                        />
                    )}
                </div>
            </div>
        </div>
    );

    const weekDays = calculateWeekDays();

    return (
        <div className="timesheet-detail">
            <Card header={cardHeader} className="timesheet-detail-card">
                <div className="grid">
                    {/* Timesheet Information */}
                    <div className="col-12 md:col-6">
                        <div className="detail-section">
                            <h4 className="text-900 font-semibold mb-3">
                                <i className="pi pi-info-circle mr-2"></i>
                                Timesheet Information
                            </h4>
                            <div className="field-group">
                                <div className="field-item">
                                    <label className="field-label">Timesheet ID</label>
                                    <p className="field-value">
                                        <Chip label={timesheet.timesheetId} className="bg-blue-100 text-blue-900" />
                                    </p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Employee ID</label>
                                    <p className="field-value">{timesheet.employeeId}</p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Period</label>
                                    <p className="field-value font-semibold">
                                        {formatDate(timesheet.periodStartDate)} - {formatDate(timesheet.periodEndDate)}
                                    </p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Status</label>
                                    <p className="field-value">
                                        <Tag 
                                            value={timesheet.status} 
                                            severity={getStatusSeverity(timesheet.status)}
                                        />
                                    </p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Total Hours</label>
                                    <p className="field-value">
                                        <Badge 
                                            value={`${timesheet.totalHours || 0} hours`} 
                                            severity={timesheet.totalHours >= 40 ? 'success' : 'warning'}
                                        />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submission Information */}
                    <div className="col-12 md:col-6">
                        <div className="detail-section">
                            <h4 className="text-900 font-semibold mb-3">
                                <i className="pi pi-calendar mr-2"></i>
                                Timeline
                            </h4>
                            <div className="field-group">
                                <div className="field-item">
                                    <label className="field-label">Created</label>
                                    <p className="field-value">{formatDateTime(timesheet.createdAt)}</p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Last Updated</label>
                                    <p className="field-value">{formatDateTime(timesheet.updatedAt)}</p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Submitted</label>
                                    <p className="field-value">
                                        {timesheet.submissionDate ? 
                                            formatDateTime(timesheet.submissionDate) : 
                                            <span className="text-500">Not submitted</span>
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Week Overview */}
                    <div className="col-12">
                        <div className="detail-section">
                            <h4 className="text-900 font-semibold mb-3">
                                <i className="pi pi-chart-bar mr-2"></i>
                                Week Overview
                            </h4>
                            <div className="week-overview">
                                {weekDays.map((day, index) => {
                                    const hours = getHoursForDay(day);
                                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                                    
                                    return (
                                        <div 
                                            key={index} 
                                            className={`day-card ${isWeekend ? 'weekend' : ''}`}
                                        >
                                            <div className="day-header">
                                                <div className="day-name">
                                                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                                </div>
                                                <div className="day-date">
                                                    {day.getDate()}
                                                </div>
                                            </div>
                                            <div className="day-hours">
                                                <Badge 
                                                    value={`${hours}h`} 
                                                    severity={hours >= 8 ? 'success' : hours > 0 ? 'warning' : 'secondary'}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Time Entries */}
                    <div className="col-12">
                        <Divider />
                        <div className="detail-section">
                            <h4 className="text-900 font-semibold mb-3">
                                <i className="pi pi-list mr-2"></i>
                                Time Entries ({entries.length})
                            </h4>
                            <DataTable
                                value={entries}
                                loading={loading}
                                emptyMessage="No time entries found"
                                className="p-datatable-sm"
                                responsiveLayout="scroll"
                            >
                                <Column
                                    field="date"
                                    header="Date"
                                    body={dateBodyTemplate}
                                    sortable
                                />
                                <Column
                                    field="projectId"
                                    header="Project"
                                    body={projectBodyTemplate}
                                />
                                <Column
                                    field="taskDescription"
                                    header="Task Description"
                                    body={taskBodyTemplate}
                                />
                                <Column
                                    field="hoursWorked"
                                    header="Hours"
                                    body={hoursBodyTemplate}
                                    sortable
                                />
                            </DataTable>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-content-end gap-2 mt-4 pt-3 border-top-1 surface-border">
                    <Button
                        label="Close"
                        icon="pi pi-times"
                        className="p-button-text"
                        onClick={onClose}
                    />
                    {permissions.canEditTimesheet() && timesheet.status === 'Draft' && (
                        <Button
                            label="Edit Timesheet"
                            icon="pi pi-pencil"
                            className="p-button-primary"
                            onClick={onEdit}
                        />
                    )}
                    {permissions.canSubmitTimesheet() && timesheet.status === 'Draft' && (
                        <Button
                            label="Submit for Approval"
                            icon="pi pi-send"
                            className="p-button-warning"
                            onClick={onSubmit}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default TimesheetDetail;
