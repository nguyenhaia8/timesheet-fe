import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL + '/approvals';

class ApprovalService {
    // Create approval for a timesheet
    static async createApproval(timesheetId, status = 'PENDING') {
        try {
            const payload = { timesheetId, status };
            const response = await axios.post(API_BASE_URL, payload);
            return response.data;
        } catch (error) {
            console.error('Error creating approval:', error);
            throw error;
        }
    }

    // Get approvals by timesheetId
    static async getApprovalsByTimesheetId(timesheetId) {
        try {
            const response = await axios.get(`${API_BASE_URL}?timesheetId=${timesheetId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching approvals:', error);
            throw error;
        }
    }

    // Update approval by approvalId
    static async updateApproval(approvalId, payload) {
        try {
            const response = await axios.put(`${API_BASE_URL}/${approvalId}`, payload);
            return response.data;
        } catch (error) {
            console.error('Error updating approval:', error);
            throw error;
        }
    }

    // Get all approvals for the logged-in user
    static async getMyApprovals() {
        try {
            const response = await axios.get(`${API_BASE_URL}/my-approvals`);
            return response.data;
        } catch (error) {
            console.error('Error fetching my approvals:', error);
            throw error;
        }
    }
}

export default ApprovalService;
