// approvalService.js - cleaned up, only function-based exports
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/approvals';

export async function createApproval(approvalPayload) {
    const userData = localStorage.getItem('userData');
    const token = userData ? JSON.parse(userData).token : null;
    try {
        const response = await axios.post(API_BASE_URL, approvalPayload, {
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating approval:', error);
        throw error;
    }
}

export async function getMyApprovals() {
    const userData = localStorage.getItem('userData');
    const token = userData ? JSON.parse(userData).token : null;
    try {
        const response = await axios.get(`${API_BASE_URL}/my-approvals`, {
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching my approvals:', error);
        throw error;
    }
}

export async function getApprovalsByTimesheetId(timesheetId) {
    const userData = localStorage.getItem('userData');
    const token = userData ? JSON.parse(userData).token : null;
    try {
        const response = await axios.get(`${API_BASE_URL}/timesheet/${timesheetId}`, {
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching approvals by timesheetId:', error);
        throw error;
    }
}

export async function updateApproval(approvalId, payload) {
    const userData = localStorage.getItem('userData');
    const token = userData ? JSON.parse(userData).token : null;
    try {
        const response = await axios.put(`${API_BASE_URL}/${approvalId}`, payload, {
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating approval:', error);
        throw error;
    }
}
