import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { useRef } from 'react';
import ApprovalQueue from './ApprovalQueue';
import ApprovalDetail from './ApprovalDetail';
import ApprovalForm from './ApprovalForm';
import ApprovalService from '../../services/approvalService';
// import { usePermissions } from '../../hooks/usePermissions';
import './ApprovalManagement.css';

const ApprovalManagement = ({ user }) => {
    const roles = user?.roles || [];
    const [activeIndex, setActiveIndex] = useState(0);
    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [approvalHistory, setApprovalHistory] = useState([]);
    const [selectedApproval, setSelectedApproval] = useState(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const [approvalFormVisible, setApprovalFormVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [statistics, setStatistics] = useState(null);
    
    const toast = useRef(null);

    useEffect(() => {
        loadData();
        loadStatistics();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [pendingResult, historyResult] = await Promise.all([
                ApprovalService.getPendingApprovals(),
                ApprovalService.getApprovalHistory()
            ]);

            if (pendingResult.success) {
                setPendingApprovals(pendingResult.data);
            } else {
                showError('Failed to load pending approvals: ' + pendingResult.error);
            }

            if (historyResult.success) {
                setApprovalHistory(historyResult.data);
            } else {
                showError('Failed to load approval history: ' + historyResult.error);
            }
        } catch (error) {
            showError('Failed to load approval data');
            console.error('Error loading approval data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadStatistics = async () => {
        try {
            const result = await ApprovalService.getApprovalStatistics();
            if (result.success) {
                setStatistics(result.data);
            }
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    };

    const handleViewDetails = (approval) => {
        setSelectedApproval(approval);
        setDetailVisible(true);
    };

    const handleApprovalAction = (approval) => {
        setSelectedApproval(approval);
        setApprovalFormVisible(true);
    };

    const handleApprove = async (approvalId, comments) => {
        setActionLoading(true);
        try {
            const result = await ApprovalService.approveTimesheet(approvalId, comments);
            
            if (result.success) {
                showSuccess(result.message || 'Timesheet approved successfully');
                setApprovalFormVisible(false);
                await loadData();
                await loadStatistics();
            } else {
                showError(result.error || 'Failed to approve timesheet');
            }
        } catch (error) {
            showError('Failed to approve timesheet');
            console.error('Error approving timesheet:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (approvalId, comments) => {
        setActionLoading(true);
        try {
            const result = await ApprovalService.rejectTimesheet(approvalId, comments);
            
            if (result.success) {
                showSuccess(result.message || 'Timesheet rejected');
                setApprovalFormVisible(false);
                await loadData();
                await loadStatistics();
            } else {
                showError(result.error || 'Failed to reject timesheet');
            }
        } catch (error) {
            showError('Failed to reject timesheet');
            console.error('Error rejecting timesheet:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleQuickApprove = async (approval) => {
        setActionLoading(true);
        try {
            const result = await ApprovalService.approveTimesheet(
                approval.approvalId, 
                'Quick approval'
            );
            
            if (result.success) {
                showSuccess('Timesheet approved successfully');
                await loadData();
                await loadStatistics();
            } else {
                showError(result.error || 'Failed to approve timesheet');
            }
        } catch (error) {
            showError('Failed to approve timesheet');
            console.error('Error approving timesheet:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleBulkApprove = async (approvalIds) => {
        setActionLoading(true);
        try {
            const result = await ApprovalService.bulkApprove(approvalIds, 'Bulk approval');
            
            if (result.success) {
                showSuccess(result.message || 'Timesheets approved successfully');
                await loadData();
                await loadStatistics();
            } else {
                showError(result.error || 'Failed to approve timesheets');
            }
        } catch (error) {
            showError('Failed to approve timesheets');
            console.error('Error bulk approving timesheets:', error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRefresh = () => {
        loadData();
        loadStatistics();
    };

    const showSuccess = (message) => {
        toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: message,
            life: 3000
        });
    };

    const showError = (message) => {
        toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 5000
        });
    };

    const showInfo = (message) => {
        toast.current?.show({
            severity: 'info',
            summary: 'Info',
            detail: message,
            life: 3000
        });
    };

    // Check if user can access approval features
    if (!(roles.includes('ROLE_ADMIN') || roles.includes('ROLE_MANAGER'))) {
        return (
            <div className="flex justify-content-center align-items-center h-20rem">
                <Card>
                    <div className="text-center">
                        <i className="pi pi-lock text-6xl text-300 mb-3"></i>
                        <h3 className="text-900 font-bold">Access Denied</h3>
                        <p className="text-600 m-0">
                            You don't have permission to view approvals.
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="approval-management">
            <Toast ref={toast} />
            <ConfirmDialog />
            
            <div className="approval-management-header mb-4">
                <Card>
                    <div className="flex justify-content-between align-items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-900 m-0 mb-2">
                                <i className="pi pi-thumbs-up mr-3 text-primary"></i>
                                Timesheet Approvals
                            </h2>
                            <p className="text-600 m-0">
                                Review and approve submitted timesheets
                            </p>
                        </div>
                        
                        {/* Statistics */}
                        {statistics && (
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-500">
                                        {statistics.pending}
                                    </div>
                                    <div className="text-sm text-600">Pending</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-500">
                                        {statistics.approved}
                                    </div>
                                    <div className="text-sm text-600">Approved</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-500">
                                        {statistics.rejected}
                                    </div>
                                    <div className="text-sm text-600">Rejected</div>
                                </div>
                                {statistics.avgApprovalTime > 0 && (
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-500">
                                            {statistics.avgApprovalTime}
                                        </div>
                                        <div className="text-sm text-600">Avg Days</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            <Card>
                <TabView 
                    activeIndex={activeIndex} 
                    onTabChange={(e) => setActiveIndex(e.index)}
                    className="approval-tabs"
                >
                    <TabPanel 
                        header={`Pending (${pendingApprovals.length})`}
                        leftIcon="pi pi-clock mr-2"
                    >
                        <ApprovalQueue
                            approvals={pendingApprovals}
                            loading={loading}
                            actionLoading={actionLoading}
                            onViewDetails={handleViewDetails}
                            onApprovalAction={handleApprovalAction}
                            onQuickApprove={handleQuickApprove}
                            onBulkApprove={handleBulkApprove}
                            onRefresh={handleRefresh}
                            // permissions removed
                            user={user}
                            type="pending"
                        />
                    </TabPanel>
                    
                    <TabPanel 
                        header={`History (${approvalHistory.length})`}
                        leftIcon="pi pi-history mr-2"
                    >
                        <ApprovalQueue
                            approvals={approvalHistory}
                            loading={loading}
                            actionLoading={actionLoading}
                            onViewDetails={handleViewDetails}
                            onRefresh={handleRefresh}
                            // permissions removed
                            user={user}
                            type="history"
                        />
                    </TabPanel>
                </TabView>
            </Card>

            {/* Approval Detail Dialog */}
            {detailVisible && (
                <ApprovalDetail
                    approval={selectedApproval}
                    onApprove={handleApprovalAction}
                    onClose={() => setDetailVisible(false)}
                    // permissions removed
                />
            )}

            {/* Approval Form Dialog */}
            <ApprovalForm
                visible={approvalFormVisible}
                onHide={() => setApprovalFormVisible(false)}
                approval={selectedApproval}
                onApprove={handleApprove}
                onReject={handleReject}
                loading={actionLoading}
            />
        </div>
    );
};

export default ApprovalManagement;
