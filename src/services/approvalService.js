// approvalService.js - cleaned up, only function-based exports
import apiClient from '../utils/axiosConfig';

const API_BASE_URL = '/approvals';

export async function createApproval(approvalPayload) {
    try {
        const response = await apiClient.post(API_BASE_URL, approvalPayload);
        return response.data;
    } catch (error) {
        console.error('Error creating approval:', error);
        throw error;
    }
}

export async function getMyApprovals() {
    try {
        const response = await apiClient.get(`${API_BASE_URL}/my-approvals`);
        return response.data;
    } catch (error) {
        console.error('Error fetching my approvals:', error);
        throw error;
    }
}

export async function getApprovalsByTimesheetId(timesheetId) {
    try {
        const response = await apiClient.get(`${API_BASE_URL}/timesheet/${timesheetId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching approvals by timesheetId:', error);
        throw error;
    }
}

export async function updateApproval(approvalId, payload) {
    try {
        const response = await apiClient.put(`${API_BASE_URL}/${approvalId}`, payload);
        return response.data;
    } catch (error) {
        console.error('Error updating approval:', error);
        throw error;
    }
}
