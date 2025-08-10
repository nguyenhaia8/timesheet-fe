import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Toolbar } from 'primereact/toolbar';
import { Toast } from 'primereact/toast';
import { createApproval, getApprovalsByTimesheetId, getMyApprovals, updateApproval } from '../../services/approvalService';
import './ApprovalList.css';

const ApprovalList = () => {
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
            </DataTable>
        </div>
    );
};

export default ApprovalList;
