// src/services/departmentService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL + '/departments';

const getAuthHeaders = () => {
    const token = localStorage.getItem('timetracker_token') || sessionStorage.getItem('timetracker_token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

export const departmentService = {
    getDepartments: async () => {
        const response = await axios.get(API_BASE_URL, { headers: getAuthHeaders() });
        return response;
    },
    createDepartment: async (departmentData) => {
        const response = await axios.post(API_BASE_URL, departmentData, { headers: getAuthHeaders() });
        return response;
    },
    updateDepartment: async (departmentId, departmentData) => {
        const response = await axios.put(`${API_BASE_URL}/${departmentId}`, departmentData, { headers: getAuthHeaders() });
        return response;
    },
    deleteDepartment: async (departmentId) => {
        const response = await axios.delete(`${API_BASE_URL}/${departmentId}`, { headers: getAuthHeaders() });
        return response;
    },
};
