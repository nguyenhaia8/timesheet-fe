import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Chip } from 'primereact/chip';
import './ApprovalDetail.css';

const ApprovalDetail = ({ approval, onApprove, onClose, permissions }) => {
    if (!approval) {
        return (
            <div className="flex justify-content-center align-items-center h-20rem">
                <p className="text-500">No approval data available</p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateRange = (startDate, endDate) => {
        const start = new Date(startDate).toLocaleDateString();
        const end = new Date(endDate).toLocaleDateString();
        return `${start} - ${end}`;
    };

    const getInitials = () => {
        return approval.employeeName?.split(' ').map(n => n.charAt(0)).join('') || 'UN';
    };

    const getStatusSeverity = (status) => {
        switch (status) {
            case 'Pending': return 'warning';
            case 'Approved': return 'success';
            case 'Rejected': return 'danger';
            default: return 'info';
        }
    };

    const calculateWorkDays = () => {
        const start = new Date(approval.periodStartDate);
        const end = new Date(approval.periodEndDate);
        let workDays = 0;
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dayOfWeek = d.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
                workDays++;
            }
        }
        return workDays;
    };

    const cardHeader = (
        <div className="approval-detail-header">
            <div className="flex align-items-center gap-3 mb-3">
                <Avatar 
                    label={getInitials()} 
                    size="xlarge" 
                    shape="circle" 
                    className="approval-avatar"
                />
                <div className="flex-1">
                    <h2 className="m-0 text-2xl font-bold text-900">
                        {approval.employeeName}
                    </h2>
                    <p className="m-0 text-lg text-600 mt-1">{approval.employeeEmail}</p>
                    <div className="flex align-items-center gap-2 mt-2">
                        <Tag 
                            value={approval.status} 
                            severity={getStatusSeverity(approval.status)}
                        />
                        <Chip 
                            label={`${approval.totalHours || 0} hours`} 
                            className="bg-primary-100 text-primary-900"
                        />
                    </div>
                </div>
                {permissions.canApproveTimesheets() && approval.status === 'Pending' && (
                    <Button
                        icon="pi pi-comment"
                        label="Approve/Reject"
                        className="p-button-outlined"
                        onClick={() => onApprove(approval)}
                    />
                )}
            </div>
        </div>
    );

    return (
        <div className="approval-detail">
            <Card header={cardHeader} className="approval-detail-card">
                <div className="grid">
                    {/* Timesheet Information */}
                    <div className="col-12 md:col-6">
                        <div className="detail-section">
                            <h4 className="text-900 font-semibold mb-3">
                                <i className="pi pi-calendar mr-2"></i>
                                Timesheet Information
                            </h4>
                            <div className="field-group">
                                <div className="field-item">
                                    <label className="field-label">Period</label>
                                    <p className="field-value font-semibold">
                                        {formatDateRange(approval.periodStartDate, approval.periodEndDate)}
                                    </p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Total Hours</label>
                                    <p className="field-value">
                                        <span className="text-2xl font-bold text-primary">
                                            {approval.totalHours || 0}
                                        </span>
                                        <span className="text-500 ml-1">hours</span>
                                    </p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Expected Work Days</label>
                                    <p className="field-value">
                                        <span className="font-semibold">{calculateWorkDays()}</span>
                                        <span className="text-500 ml-1">days</span>
                                    </p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Average Hours/Day</label>
                                    <p className="field-value">
                                        <span className="font-semibold">
                                            {calculateWorkDays() > 0 ? ((approval.totalHours || 0) / calculateWorkDays()).toFixed(1) : '0'}
                                        </span>
                                        <span className="text-500 ml-1">hours/day</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submission Details */}
                    <div className="col-12 md:col-6">
                        <div className="detail-section">
                            <h4 className="text-900 font-semibold mb-3">
                                <i className="pi pi-send mr-2"></i>
                                Submission Details
                            </h4>
                            <div className="field-group">
                                <div className="field-item">
                                    <label className="field-label">Submitted Date</label>
                                    <p className="field-value">{formatDate(approval.submissionDate)}</p>
                                </div>
                                <div className="field-item">
                                    <label className="field-label">Status</label>
                                    <p className="field-value">
                                        <Tag 
                                            value={approval.status} 
                                            severity={getStatusSeverity(approval.status)}
                                        />
                                    </p>
                                </div>
                                {approval.approvedBy && (
                                    <div className="field-item">
                                        <label className="field-label">
                                            {approval.status === 'Approved' ? 'Approved By' : 'Reviewed By'}
                                        </label>
                                        <p className="field-value font-semibold">{approval.approverName}</p>
                                    </div>
                                )}
                                {approval.approvedAt && (
                                    <div className="field-item">
                                        <label className="field-label">
                                            {approval.status === 'Approved' ? 'Approved Date' : 'Review Date'}
                                        </label>
                                        <p className="field-value">{formatDate(approval.approvedAt)}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Project Summary */}
                    <div className="col-12">
                        <div className="detail-section">
                            <h4 className="text-900 font-semibold mb-3">
                                <i className="pi pi-briefcase mr-2"></i>
                                Project Summary
                            </h4>
                            {approval.projectBreakdown && approval.projectBreakdown.length > 0 ? (
                                <div className="grid">
                                    {approval.projectBreakdown.map((project, index) => (
                                        <div key={index} className="col-12 md:col-6 lg:col-4">
                                            <div className="bg-surface-50 p-3 border-round">
                                                <div className="flex justify-content-between align-items-center mb-2">
                                                    <span className="font-semibold text-900">{project.projectName}</span>
                                                    <Chip 
                                                        label={`${project.hours}h`} 
                                                        className="bg-primary-100 text-primary-900"
                                                    />
                                                </div>
                                                <div className="text-sm text-600">
                                                    {((project.hours / (approval.totalHours || 1)) * 100).toFixed(1)}% of total hours
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-500">No project breakdown available</p>
                            )}
                        </div>
                    </div>

                    {/* Comments */}
                    {approval.comments && (
                        <div className="col-12">
                            <Divider />
                            <div className="detail-section">
                                <h4 className="text-900 font-semibold mb-3">
                                    <i className="pi pi-comment mr-2"></i>
                                    {approval.status === 'Approved' ? 'Approval' : 'Review'} Comments
                                </h4>
                                <div className="bg-gray-50 p-3 border-round">
                                    <p className="m-0 line-height-3 text-700">{approval.comments}</p>
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
                    {permissions.canApproveTimesheets() && approval.status === 'Pending' && (
                        <Button
                            label="Approve/Reject"
                            icon="pi pi-comment"
                            className="p-button-primary"
                            onClick={() => onApprove(approval)}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ApprovalDetail;
