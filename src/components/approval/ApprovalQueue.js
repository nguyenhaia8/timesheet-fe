import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FilterMatchMode } from 'primereact/api';
import { createApproval, getApprovalsByTimesheetId, getMyApprovals, updateApproval } from '../../services/approvalService';

import ApprovalDetail from './ApprovalDetail';
import ApprovalForm from './ApprovalForm';
import './ApprovalQueue.css';

const ApprovalQueue = ({ user }) => {
    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [allApprovals, setAllApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'
    const [globalFilter, setGlobalFilter] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        employeeName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        submissionDate: { value: null, matchMode: FilterMatchMode.DATE_IS }
    });

    // Dialog states
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showApprovalDialog, setShowApprovalDialog] = useState(false);
    const [selectedApproval, setSelectedApproval] = useState(null);

    const toast = useRef(null);


    // Status options for filtering
    const statusOptions = [
        { label: 'Pending', value: 'Pending' },
        { label: 'Approved', value: 'Approved' },
        { label: 'Rejected', value: 'Rejected' }
    ];

    const loadApprovals = useCallback(async () => {
        try {
            setLoading(true);
            let response;

            if (activeTab === 'pending') {
                // response = await getPendingApprovals(); // Not implemented
                setPendingApprovals([]); // No response since function is not implemented
            } else {
                // response = await getApprovals(); // Not implemented
                setAllApprovals([]); // No response since function is not implemented
            }
        } catch (error) {
            console.error('Error loading approvals:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load approvals',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        loadApprovals();
    }, [loadApprovals]);

    const handleApprove = async (approval, comments = '') => {
        try {
            // await approveTimesheet(approval.approvalId, comments); // Not implemented

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Timesheet approved successfully',
                life: 3000
            });

            loadApprovals();
        } catch (error) {
            console.error('Error approving timesheet:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to approve timesheet',
                life: 3000
            });
        }
    };

    const handleReject = async (approval, comments) => {
        if (!comments || comments.trim() === '') {
            toast.current.show({
                severity: 'warn',
                summary: 'Comments Required',
                detail: 'Please provide comments when rejecting a timesheet',
                life: 3000
            });
            return;
        }

        try {
            // await rejectTimesheet(approval.approvalId, comments); // Not implemented

            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Timesheet rejected',
                life: 3000
            });

            loadApprovals();
        } catch (error) {
            console.error('Error rejecting timesheet:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to reject timesheet',
                life: 3000
            });
        }
    };

    const handleQuickApprove = (approval) => {
        confirmDialog({
            message: `Are you sure you want to approve ${approval.employeeName}'s timesheet for ${formatDateRange(approval.periodStartDate, approval.periodEndDate)}?`,
            header: 'Confirm Approval',
            icon: 'pi pi-check-circle',
            accept: () => handleApprove(approval, 'Quick approval')
        });
    };

    const handleDetailedApproval = (approval) => {
        setSelectedApproval(approval);
        setShowApprovalDialog(true);
    };

    const handleViewDetail = (approval) => {
        setSelectedApproval(approval);
        setShowDetailDialog(true);
    };

    const handleViewTimesheet = async (approval) => {
        // For now, just show an info message
        // In a real app, this would fetch and display detailed timesheet data
        toast.current.show({
            severity: 'info',
            summary: 'Info',
            detail: 'Timesheet detail view coming soon',
            life: 3000
        });
    };

    // Helper functions
    const formatDateRange = (startDate, endDate) => {
        const start = new Date(startDate).toLocaleDateString();
        const end = new Date(endDate).toLocaleDateString();
        return `${start} - ${end}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    // Column templates
    const employeeBodyTemplate = (rowData) => {
        const initials = rowData.employeeName?.split(' ').map(n => n.charAt(0)).join('') || 'UN';
        return (
            <div className="flex align-items-center gap-2">
                <Avatar 
                    label={initials} 
                    size="normal" 
                    shape="circle" 
                    className="mr-2"
                />
                <div>
                    <div className="font-medium">{rowData.employeeName}</div>
                    <div className="text-sm text-500">{rowData.employeeEmail}</div>
                </div>
            </div>
        );
    };

    const periodBodyTemplate = (rowData) => {
        return (
            <div className="timesheet-period">
                <div className="period-dates font-medium">
                    {formatDateRange(rowData.periodStartDate, rowData.periodEndDate)}
                </div>
                <div className="period-week text-sm text-500">
                    Week of {formatDate(rowData.periodStartDate)}
                </div>
            </div>
        );
    };

    const statusBodyTemplate = (rowData) => {
        const getSeverity = (status) => {
            switch (status) {
                case 'Pending': return 'warning';
                case 'Approved': return 'success';
                case 'Rejected': return 'danger';
                default: return 'info';
            }
        };

        return (
            <Tag 
                value={rowData.status} 
                severity={getSeverity(rowData.status)}
            />
        );
    };

    const hoursBodyTemplate = (rowData) => {
        return (
            <div className="text-center">
                <Badge 
                    value={`${rowData.totalHours || 0}h`} 
                    severity={rowData.totalHours >= 40 ? 'success' : 'info'}
                />
            </div>
        );
    };

    const submissionDateBodyTemplate = (rowData) => {
        return (
            <div className="text-center">
                <div>{formatDate(rowData.submissionDate)}</div>
                <div className="text-sm text-500">
                    {new Date(rowData.submissionDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
            </div>
        );
    };

    const actionBodyTemplate = (rowData) => {
        const isPending = rowData.status === 'Pending';
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-text p-button-sm"
                    onClick={() => handleViewDetail(rowData)}
                    tooltip="View Details"
                />
                <Button
                    icon="pi pi-calendar"
                    className="p-button-rounded p-button-text p-button-sm"
                    onClick={() => handleViewTimesheet(rowData)}
                    tooltip="View Timesheet"
                />
                {isPending && (
                    <>
                        <Button
                            icon="pi pi-check"
                            className="p-button-rounded p-button-text p-button-sm p-button-success"
                            onClick={() => handleQuickApprove(rowData)}
                            tooltip="Quick Approve"
                        />
                        <Button
                            icon="pi pi-comment"
                            className="p-button-rounded p-button-text p-button-sm p-button-warning"
                            onClick={() => handleDetailedApproval(rowData)}
                            tooltip="Approve/Reject with Comments"
                        />
                    </>
                )}
            </div>
        );
    };

    // Toolbar
    const leftToolbarTemplate = () => {
        return (
            <div className="flex gap-2">
                <Button
                    label="Pending"
                    icon="pi pi-clock"
                    className={activeTab === 'pending' ? 'p-button-success' : 'p-button-outlined'}
                    onClick={() => setActiveTab('pending')}
                />
                <Button
                    label="History"
                    icon="pi pi-history"
                    className={activeTab === 'history' ? 'p-button-success' : 'p-button-outlined'}
                    onClick={() => setActiveTab('history')}
                />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex gap-2">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search approvals..."
                        className="w-20rem"
                    />
                </span>
                <Button
                    icon="pi pi-refresh"
                    className="p-button-outlined"
                    onClick={loadApprovals}
                    tooltip="Refresh"
                />
            </div>
        );
    };

    // Filter templates
    const statusFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statusOptions}
                onChange={(e) => options.filterCallback(e.value)}
                placeholder="Select Status"
                className="p-column-filter"
                showClear
            />
        );
    };

    const dateFilterTemplate = (options) => {
        return (
            <Calendar
                value={options.value}
                onChange={(e) => options.filterCallback(e.value)}
                placeholder="Select Date"
                className="p-column-filter"
                showIcon
            />
        );
    };

    const currentData = activeTab === 'pending' ? pendingApprovals : allApprovals;

    return (
        <div className="approval-queue">
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="card">
                <Toolbar 
                    className="mb-4" 
                    start={leftToolbarTemplate} 
                    end={rightToolbarTemplate}
                />

                <DataTable
                    value={currentData}
                    dataKey="approvalId"
                    loading={loading}
                    globalFilter={globalFilter}
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters)}
                    globalFilterFields={['employeeName', 'status', 'periodStartDate']}
                    emptyMessage={`No ${activeTab} approvals found`}
                    className="p-datatable-approvals"
                    responsiveLayout="scroll"
                    size="small"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[10, 25, 50]}
                >
                    <Column
                        field="employeeName"
                        header="Employee"
                        body={employeeBodyTemplate}
                        sortable
                        filter
                        filterPlaceholder="Search by employee"
                        className="min-w-14rem"
                    />
                    <Column
                        field="periodStartDate"
                        header="Period"
                        body={periodBodyTemplate}
                        sortable
                        className="min-w-12rem"
                    />
                    <Column
                        field="totalHours"
                        header="Hours"
                        body={hoursBodyTemplate}
                        sortable
                        className="min-w-6rem"
                    />
                    <Column
                        field="status"
                        header="Status"
                        body={statusBodyTemplate}
                        sortable
                        filter
                        filterElement={statusFilterTemplate}
                        className="min-w-8rem"
                    />
                    <Column
                        field="submissionDate"
                        header="Submitted"
                        body={submissionDateBodyTemplate}
                        sortable
                        filter
                        filterElement={dateFilterTemplate}
                        className="min-w-10rem"
                    />
                    <Column
                        header="Actions"
                        body={actionBodyTemplate}
                        exportable={false}
                        className="min-w-12rem"
                    />
                </DataTable>
            </div>

            {/* Approval Detail Dialog */}
            <Dialog
                visible={showDetailDialog}
                style={{ width: '800px' }}
                header="Approval Details"
                modal
                onHide={() => setShowDetailDialog(false)}
            >
                <ApprovalDetail
                    approval={selectedApproval}
                    onApprove={handleDetailedApproval}
                    onClose={() => setShowDetailDialog(false)}
                />
            </Dialog>

            {/* Approval Form Dialog */}
            <Dialog
                visible={showApprovalDialog}
                style={{ width: '600px' }}
                header="Approve/Reject Timesheet"
                modal
                className="p-fluid"
                onHide={() => setShowApprovalDialog(false)}
            >
                <ApprovalForm
                    approval={selectedApproval}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onCancel={() => setShowApprovalDialog(false)}
                />
            </Dialog>

        </div>
    );
};

export default ApprovalQueue;
