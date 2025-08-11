// src/services/departmentService.js
import apiClient from '../utils/axiosConfig';

const API_BASE_URL = '/departments';

export const departmentService = {
    getDepartments: async () => {
        const response = await apiClient.get(API_BASE_URL);
        return response;
    },
    createDepartment: async (departmentData) => {
        const response = await apiClient.post(API_BASE_URL, departmentData);
        return response;
    },
    updateDepartment: async (departmentId, departmentData) => {
        const response = await apiClient.put(`${API_BASE_URL}/${departmentId}`, departmentData);
        return response;
    },
    deleteDepartment: async (departmentId) => {
        const response = await apiClient.delete(`${API_BASE_URL}/${departmentId}`);
        return response;
    },
};
