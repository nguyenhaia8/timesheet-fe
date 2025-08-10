import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import ApprovalService from '../../services/approvalService';
import './ApprovalList.css';

const ApprovalList = () => {
    const [approvals, setApprovals] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);

    useEffect(() => {
        const fetchApprovals = async () => {
            try {
                const response = await ApprovalService.getMyApprovals();
                setApprovals(response.data || response || []);
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

    return (
        <div className="approval-list">
            <Toast ref={toast} />
            <div className="card">
                <h3>My Approvals</h3>
                <DataTable
                    value={approvals}
                    loading={loading}
                    dataKey="approvalId"
                    emptyMessage="No approvals found"
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
        </div>
    );
};

export default ApprovalList;
