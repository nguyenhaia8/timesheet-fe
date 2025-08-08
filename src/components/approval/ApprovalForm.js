import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Divider } from 'primereact/divider';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import { Chip } from 'primereact/chip';
import { confirmDialog } from 'primereact/confirmdialog';
import './ApprovalForm.css';

const ApprovalForm = ({ 
    visible, 
    onHide, 
    approval, 
    onApprove, 
    onReject,
    loading = false 
}) => {
    const [comments, setComments] = useState('');
    const [action, setAction] = useState(null); // 'approve' or 'reject'

    const handleSubmit = () => {
        if (!action) return;

        const confirmMessage = action === 'approve' 
            ? 'Are you sure you want to approve this timesheet?'
            : 'Are you sure you want to reject this timesheet?';

        confirmDialog({
            message: confirmMessage,
            header: `Confirm ${action === 'approve' ? 'Approval' : 'Rejection'}`,
            icon: `pi pi-${action === 'approve' ? 'check-circle' : 'times-circle'}`,
            acceptClassName: action === 'approve' ? 'p-button-success' : 'p-button-danger',
            accept: () => {
                if (action === 'approve') {
                    onApprove(approval.approvalId, comments);
                } else {
                    onReject(approval.approvalId, comments);
                }
                resetForm();
            }
        });
    };

    const resetForm = () => {
        setComments('');
        setAction(null);
    };

    const handleHide = () => {
        resetForm();
        onHide();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateRange = (startDate, endDate) => {
        const start = formatDate(startDate);
        const end = formatDate(endDate);
        return `${start} - ${end}`;
    };

    const getInitials = () => {
        return approval?.employeeName?.split(' ').map(n => n.charAt(0)).join('') || 'UN';
    };

    if (!approval) return null;

    const dialogHeader = (
        <div className="approval-form-header">
            <div className="flex align-items-center gap-3">
                <i className="pi pi-comment text-2xl text-primary"></i>
                <div>
                    <h3 className="m-0 text-xl font-bold">Timesheet Review</h3>
                    <p className="m-0 text-sm text-600">Review and provide decision for submitted timesheet</p>
                </div>
            </div>
        </div>
    );

    return (
        <Dialog
            header={dialogHeader}
            visible={visible}
            onHide={handleHide}
            style={{ width: '50rem' }}
            maximizable
            modal
            className="approval-form-dialog"
        >
            <div className="approval-form-content">
                {/* Employee and Timesheet Summary */}
                <Card className="employee-summary-card mb-4">
                    <div className="flex align-items-center gap-3 mb-3">
                        <Avatar 
                            label={getInitials()} 
                            size="large" 
                            shape="circle" 
                            className="approval-avatar"
                        />
                        <div className="flex-1">
                            <h4 className="m-0 text-lg font-bold text-900">
                                {approval.employeeName}
                            </h4>
                            <p className="m-0 text-sm text-600">{approval.employeeEmail}</p>
                        </div>
                        <div className="text-right">
                            <Chip 
                                label={`${approval.totalHours || 0} hours`} 
                                className="bg-primary-100 text-primary-900 mb-2"
                            />
                            <div className="text-sm text-600">
                                {formatDateRange(approval.periodStartDate, approval.periodEndDate)}
                            </div>
                        </div>
                    </div>

                    {/* Project Breakdown */}
                    {approval.projectBreakdown && approval.projectBreakdown.length > 0 && (
                        <div className="project-breakdown">
                            <h5 className="text-900 font-semibold mb-2">Project Hours:</h5>
                            <div className="flex flex-wrap gap-2">
                                {approval.projectBreakdown.map((project, index) => (
                                    <div key={index} className="project-chip">
                                        <span className="project-name">{project.projectName}</span>
                                        <span className="project-hours">{project.hours}h</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Card>

                <Divider />

                {/* Decision Section */}
                <div className="decision-section">
                    <h4 className="text-900 font-semibold mb-3">
                        <i className="pi pi-thumbs-up-fill mr-2"></i>
                        Your Decision
                    </h4>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-4">
                        <Button
                            label="Approve"
                            icon="pi pi-check"
                            className={`p-button-success ${action === 'approve' ? 'p-button-raised' : 'p-button-outlined'}`}
                            onClick={() => setAction('approve')}
                            disabled={loading}
                        />
                        <Button
                            label="Reject"
                            icon="pi pi-times"
                            className={`p-button-danger ${action === 'reject' ? 'p-button-raised' : 'p-button-outlined'}`}
                            onClick={() => setAction('reject')}
                            disabled={loading}
                        />
                    </div>

                    {/* Action Indicator */}
                    {action && (
                        <div className="action-indicator mb-3">
                            <Tag 
                                value={action === 'approve' ? 'Will Approve' : 'Will Reject'} 
                                severity={action === 'approve' ? 'success' : 'danger'}
                                icon={`pi pi-${action === 'approve' ? 'check' : 'times'}`}
                            />
                        </div>
                    )}

                    {/* Comments */}
                    <div className="field">
                        <label htmlFor="comments" className="font-semibold text-900 mb-2 block">
                            Comments {action === 'reject' && <span className="text-red-500">*</span>}
                        </label>
                        <InputTextarea
                            id="comments"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={4}
                            placeholder={
                                action === 'approve' 
                                    ? "Add any approval notes or feedback (optional)..."
                                    : action === 'reject'
                                        ? "Please provide reason for rejection..."
                                        : "Select approve or reject to add comments..."
                            }
                            className="w-full"
                            disabled={!action || loading}
                            autoResize
                        />
                        {action === 'reject' && !comments.trim() && (
                            <small className="text-red-500 mt-1 block">
                                Comments are required when rejecting a timesheet
                            </small>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-content-end gap-2 mt-4 pt-3 border-top-1 surface-border">
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        className="p-button-text"
                        onClick={handleHide}
                        disabled={loading}
                    />
                    <Button
                        label={loading ? 'Processing...' : 'Submit Decision'}
                        icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-send'}
                        className="p-button-primary"
                        onClick={handleSubmit}
                        disabled={
                            !action || 
                            loading || 
                            (action === 'reject' && !comments.trim())
                        }
                    />
                </div>
            </div>
        </Dialog>
    );
};

export default ApprovalForm;
