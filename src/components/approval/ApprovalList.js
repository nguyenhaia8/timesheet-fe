import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { createApproval, getApprovalsByTimesheetId, getMyApprovals, updateApproval } from '../../services/approvalService';
import { timesheetService } from '../../services/timesheetService';
import { employeeService } from '../../services/employeeService';
import { projectService } from '../../services/projectService';
import { Dialog } from 'primereact/dialog';
import './ApprovalList.css';

const ApprovalList = () => {
    const [reviewComments, setReviewComments] = useState("");
    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const toast = useRef(null);

    useEffect(() => {
        const fetchApprovals = async () => {
            try {
                const response = await getMyApprovals();
                const data = response.data || response || [];
                setApprovals(data);
                setTotalRecords(data.length);
            } catch (error) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load approvals',
                    life: 3000
                });
            } finally {
                setLoading(false);
            }
        };
        fetchApprovals();
    }, []);

    const statusBodyTemplate = (rowData) => {
        const getSeverity = (status) => {
            switch (status) {
                case 'PENDING': return 'warning';
                case 'APPROVED': return 'success';
                case 'REJECTED': return 'danger';
                default: return 'info';
            }
        };
        return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
    };

    // Toolbar (right side only, for consistency)
    const rightToolbarTemplate = () => (
        <div className="flex align-items-center">
            {/* Add future actions here if needed */}
        </div>
    );

    // Review dialog state
    const [reviewDialogVisible, setReviewDialogVisible] = useState(false);
    const [selectedApproval, setSelectedApproval] = useState(null);
    const [timesheetDetails, setTimesheetDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [employeeName, setEmployeeName] = useState('');
    const [projectNames, setProjectNames] = useState({});

    const openReviewDialog = async (approval) => {
        setSelectedApproval(approval);
        setReviewDialogVisible(true);
        setDetailsLoading(true);
        setEmployeeName('');
        setProjectNames({});
        setReviewComments("");
        try {
            const details = await timesheetService.getTimesheetById(approval.timesheetId);
            setTimesheetDetails(details);
            if (details && details.employeeId) {
                try {
                    const emp = await employeeService.getEmployeeById(details.employeeId);
                    setEmployeeName(emp.name || emp.fullName || emp.firstName + ' ' + emp.lastName || String(details.employeeId));
                } catch (err) {
                    setEmployeeName(String(details.employeeId));
                }
            }
            // Fetch project names for each entry
            if (details && details.timeSheetEntries) {
                const names = {};
                await Promise.all(details.timeSheetEntries.map(async (entry) => {
                    if (entry.projectId && !names[entry.projectId]) {
                        try {
                            const resp = await projectService.getProjectById(entry.projectId);
                            names[entry.projectId] = resp.data.name || resp.data.projectName || String(entry.projectId);
                        } catch {
                            names[entry.projectId] = String(entry.projectId);
                        }
                    }
                }));
                setProjectNames(names);
            }
        } catch (error) {
            setTimesheetDetails(null);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load timesheet details', life: 3000 });
        } finally {
            setDetailsLoading(false);
        }
    };
    const closeReviewDialog = () => {
        setReviewDialogVisible(false);
        setSelectedApproval(null);
        setTimesheetDetails(null);
        setEmployeeName('');
    };

    const handleApprove = async () => {
        if (!selectedApproval) return;
        try {
            // Get userData for approvedBy
            const userData = localStorage.getItem('userData');
            const approvedBy = userData ? JSON.parse(userData).userId : null;
            const payload = {
                timesheetId: selectedApproval.timesheetId,
                approvedBy,
                status: "APPROVED",
                comments: reviewComments
            };
            await updateApproval(selectedApproval.approvalId, payload);
            // Fetch latest timesheet and update status
            const latestTimesheet = await timesheetService.getTimesheetById(selectedApproval.timesheetId);
            // Build minimal payload
            const minimalPayload = {
                employeeId: latestTimesheet.employeeId,
                periodStartDate: latestTimesheet.periodStartDate,
                periodEndDate: latestTimesheet.periodEndDate,
                status: "APPROVED",
                submissionDate: latestTimesheet.submissionDate,
                totalHours: latestTimesheet.totalHours,
                timeSheetEntries: (latestTimesheet.timeSheetEntries || []).map(entry => ({
                    date: entry.date,
                    projectId: entry.projectId,
                    taskDescription: entry.taskDescription,
                    hoursWorked: entry.hoursWorked
                }))
            };
            await timesheetService.updateTimesheetWithEntries(selectedApproval.timesheetId, minimalPayload);
            toast.current.show({ severity: 'success', summary: 'Approve', detail: `Approved #${selectedApproval.approvalId}`, life: 2000 });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to approve', life: 3000 });
        }
        closeReviewDialog();
    };
    const handleReject = async () => {
        if (!selectedApproval) return;
        try {
            // Get userData for approvedBy
            const userData = localStorage.getItem('userData');
            const approvedBy = userData ? JSON.parse(userData).userId : null;
            const payload = {
                timesheetId: selectedApproval.timesheetId,
                approvedBy,
                status: "REJECTED",
                comments: reviewComments
            };
            await updateApproval(selectedApproval.approvalId, payload);
            // Fetch latest timesheet and update status
            const latestTimesheet = await timesheetService.getTimesheetById(selectedApproval.timesheetId);
            // Build minimal payload
            const minimalPayload = {
                employeeId: latestTimesheet.employeeId,
                periodStartDate: latestTimesheet.periodStartDate,
                periodEndDate: latestTimesheet.periodEndDate,
                status: "REJECTED",
                submissionDate: latestTimesheet.submissionDate,
                totalHours: latestTimesheet.totalHours,
                timeSheetEntries: (latestTimesheet.timeSheetEntries || []).map(entry => ({
                    date: entry.date,
                    projectId: entry.projectId,
                    taskDescription: entry.taskDescription,
                    hoursWorked: entry.hoursWorked
                }))
            };
            await timesheetService.updateTimesheetWithEntries(selectedApproval.timesheetId, minimalPayload);
            toast.current.show({ severity: 'warn', summary: 'Reject', detail: `Rejected #${selectedApproval.approvalId}`, life: 2000 });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to reject', life: 3000 });
        }
        closeReviewDialog();
    };

    const actionsBodyTemplate = (rowData) => (
        <Button label="Review" icon="pi pi-eye" className="p-button-info p-button-sm" onClick={() => openReviewDialog(rowData)} />
    );

    return (
        <div className="approval-list">
            <Toast ref={toast} />
            <Toolbar className="mb-3" end={rightToolbarTemplate} />
            <DataTable
                value={approvals}
                loading={loading}
                dataKey="approvalId"
                paginator
                rows={rows}
                rowsPerPageOptions={[5, 10, 25, 50]}
                totalRecords={totalRecords}
                first={first}
                onPage={(e) => { setFirst(e.first); setRows(e.rows); }}
                emptyMessage="No approvals found"
                className="p-datatable-approvals"
                responsiveLayout="scroll"
                size="small"
            >
                <Column field="approvalId" header="ID" sortable className="min-w-4rem" />
                <Column field="timesheetId" header="Timesheet" sortable className="min-w-6rem" />
                <Column field="status" header="Status" body={statusBodyTemplate} sortable className="min-w-6rem" />
                <Column field="approvedBy" header="Approved By" sortable className="min-w-8rem" />
                <Column field="comments" header="Comments" className="min-w-12rem" />
                <Column header="Actions" body={actionsBodyTemplate} exportable={false} style={{ minWidth: '8rem' }} />
            </DataTable>

            <Dialog header="Review Approval" visible={reviewDialogVisible} style={{ width: '60vw', maxWidth: '900px' }} onHide={closeReviewDialog} modal>
                {selectedApproval && (
                    <div className="p-fluid">
                        <div className="mb-3"><b>Timesheet Details:</b></div>
                        {detailsLoading ? (
                            <div className="mb-3">Loading timesheet details...</div>
                        ) : timesheetDetails ? (
                            <div>
                                <div className="mb-2"><b>Employee:</b> {employeeName || timesheetDetails.employeeId}</div>
                                <div className="mb-2"><b>Period:</b> {timesheetDetails.periodStartDate} - {timesheetDetails.periodEndDate}</div>
                                <div className="mb-2"><b>Status:</b> {timesheetDetails.status}</div>
                                <div className="mb-2"><b>Entries:</b></div>
                                <DataTable value={timesheetDetails.timeSheetEntries || []} className="p-datatable-sm p-mt-2 mb-3" responsiveLayout="scroll" size="small" showGridlines>
                                    <Column field="date" header="Date" sortable />
                                    <Column field="projectId" header="Project" body={(rowData) => projectNames[rowData.projectId] || rowData.projectId} sortable />
                                    <Column field="taskDescription" header="Task" sortable />
                                    <Column field="hoursWorked" header="Hours" sortable />
                                </DataTable>
                                <div className="mb-3">
                                    <label htmlFor="review-comments" className="block mb-2"><b>Comments:</b></label>
                                    <textarea
                                        id="review-comments"
                                        className="p-inputtext p-component"
                                        style={{ width: '100%', minHeight: '60px' }}
                                        placeholder="Add your comments here..."
                                        value={reviewComments}
                                        onChange={e => setReviewComments(e.target.value)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="mb-3">No timesheet details found.</div>
                        )}
                        <div className="flex gap-2 mt-4">
                            <Button label="Approve" icon="pi pi-check" className="p-button-success" onClick={handleApprove} />
                            <Button label="Reject" icon="pi pi-times" className="p-button-danger" onClick={handleReject} />
                            <Button label="Close" icon="pi pi-times" className="p-button-secondary" onClick={closeReviewDialog} />
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default ApprovalList;
