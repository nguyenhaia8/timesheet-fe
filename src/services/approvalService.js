import { approvals } from '../mock/data/approvals';

class ApprovalService {
    // Get all approvals
    static async getApprovals() {
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Sort by submission date (newest first)
            const sortedApprovals = [...approvals].sort((a, b) => 
                new Date(b.submissionDate) - new Date(a.submissionDate)
            );
            
            return {
                success: true,
                data: sortedApprovals
            };
        } catch (error) {
            console.error('Error fetching approvals:', error);
            return {
                success: false,
                error: 'Failed to fetch approvals'
            };
        }
    }

    // Get pending approvals
    static async getPendingApprovals() {
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const pendingApprovals = approvals
                .filter(approval => approval.status === 'Pending')
                .sort((a, b) => new Date(a.submissionDate) - new Date(b.submissionDate));
            
            return {
                success: true,
                data: pendingApprovals
            };
        } catch (error) {
            console.error('Error fetching pending approvals:', error);
            return {
                success: false,
                error: 'Failed to fetch pending approvals'
            };
        }
    }

    // Get approval history
    static async getApprovalHistory() {
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const historyApprovals = approvals
                .filter(approval => approval.status !== 'Pending')
                .sort((a, b) => new Date(b.approvedAt || b.submissionDate) - new Date(a.approvedAt || a.submissionDate));
            
            return {
                success: true,
                data: historyApprovals
            };
        } catch (error) {
            console.error('Error fetching approval history:', error);
            return {
                success: false,
                error: 'Failed to fetch approval history'
            };
        }
    }

    // Get approval by ID
    static async getApprovalById(approvalId) {
        try {
            await new Promise(resolve => setTimeout(resolve, 150));
            
            const approval = approvals.find(a => a.approvalId === approvalId);
            
            if (!approval) {
                return {
                    success: false,
                    error: 'Approval not found'
                };
            }
            
            return {
                success: true,
                data: approval
            };
        } catch (error) {
            console.error('Error fetching approval:', error);
            return {
                success: false,
                error: 'Failed to fetch approval'
            };
        }
    }

    // Approve timesheet
    static async approveTimesheet(approvalId, comments = '', approverId = 'current-user') {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const approvalIndex = approvals.findIndex(a => a.approvalId === approvalId);
            
            if (approvalIndex === -1) {
                return {
                    success: false,
                    error: 'Approval not found'
                };
            }

            // Update the approval
            approvals[approvalIndex] = {
                ...approvals[approvalIndex],
                status: 'Approved',
                approvedBy: approverId,
                approverName: 'Current User', // In real app, get from user context
                approvedAt: new Date().toISOString(),
                comments: comments || 'Approved without comments'
            };

            return {
                success: true,
                data: approvals[approvalIndex],
                message: 'Timesheet approved successfully'
            };
        } catch (error) {
            console.error('Error approving timesheet:', error);
            return {
                success: false,
                error: 'Failed to approve timesheet'
            };
        }
    }

    // Reject timesheet
    static async rejectTimesheet(approvalId, comments, approverId = 'current-user') {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const approvalIndex = approvals.findIndex(a => a.approvalId === approvalId);
            
            if (approvalIndex === -1) {
                return {
                    success: false,
                    error: 'Approval not found'
                };
            }

            if (!comments || comments.trim() === '') {
                return {
                    success: false,
                    error: 'Comments are required when rejecting a timesheet'
                };
            }

            // Update the approval
            approvals[approvalIndex] = {
                ...approvals[approvalIndex],
                status: 'Rejected',
                approvedBy: approverId,
                approverName: 'Current User', // In real app, get from user context
                approvedAt: new Date().toISOString(),
                comments: comments
            };

            return {
                success: true,
                data: approvals[approvalIndex],
                message: 'Timesheet rejected'
            };
        } catch (error) {
            console.error('Error rejecting timesheet:', error);
            return {
                success: false,
                error: 'Failed to reject timesheet'
            };
        }
    }

    // Get approvals by employee
    static async getApprovalsByEmployee(employeeId) {
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const employeeApprovals = approvals
                .filter(approval => approval.employeeId === employeeId)
                .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
            
            return {
                success: true,
                data: employeeApprovals
            };
        } catch (error) {
            console.error('Error fetching employee approvals:', error);
            return {
                success: false,
                error: 'Failed to fetch employee approvals'
            };
        }
    }

    // Get approvals by date range
    static async getApprovalsByDateRange(startDate, endDate) {
        try {
            await new Promise(resolve => setTimeout(resolve, 200));
            
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            const filteredApprovals = approvals.filter(approval => {
                const submissionDate = new Date(approval.submissionDate);
                return submissionDate >= start && submissionDate <= end;
            }).sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
            
            return {
                success: true,
                data: filteredApprovals
            };
        } catch (error) {
            console.error('Error fetching approvals by date range:', error);
            return {
                success: false,
                error: 'Failed to fetch approvals by date range'
            };
        }
    }

    // Get approval statistics
    static async getApprovalStatistics() {
        try {
            await new Promise(resolve => setTimeout(resolve, 150));
            
            const total = approvals.length;
            const pending = approvals.filter(a => a.status === 'Pending').length;
            const approved = approvals.filter(a => a.status === 'Approved').length;
            const rejected = approvals.filter(a => a.status === 'Rejected').length;
            
            // Calculate average approval time (for approved/rejected items)
            const processedApprovals = approvals.filter(a => a.approvedAt);
            let avgApprovalTime = 0;
            
            if (processedApprovals.length > 0) {
                const totalTime = processedApprovals.reduce((sum, approval) => {
                    const submitted = new Date(approval.submissionDate);
                    const processed = new Date(approval.approvedAt);
                    return sum + (processed - submitted);
                }, 0);
                
                avgApprovalTime = Math.round(totalTime / processedApprovals.length / (1000 * 60 * 60 * 24)); // Convert to days
            }
            
            return {
                success: true,
                data: {
                    total,
                    pending,
                    approved,
                    rejected,
                    approvalRate: total > 0 ? Math.round((approved / (approved + rejected)) * 100) : 0,
                    avgApprovalTime // in days
                }
            };
        } catch (error) {
            console.error('Error fetching approval statistics:', error);
            return {
                success: false,
                error: 'Failed to fetch approval statistics'
            };
        }
    }

    // Bulk approve timesheets
    static async bulkApprove(approvalIds, comments = '', approverId = 'current-user') {
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const results = [];
            
            for (const approvalId of approvalIds) {
                const result = await this.approveTimesheet(approvalId, comments, approverId);
                results.push({ approvalId, ...result });
            }
            
            const successCount = results.filter(r => r.success).length;
            const failureCount = results.length - successCount;
            
            return {
                success: failureCount === 0,
                data: results,
                message: `${successCount} timesheet(s) approved${failureCount > 0 ? `, ${failureCount} failed` : ''}`
            };
        } catch (error) {
            console.error('Error bulk approving timesheets:', error);
            return {
                success: false,
                error: 'Failed to bulk approve timesheets'
            };
        }
    }
}

export default ApprovalService;
