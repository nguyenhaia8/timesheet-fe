// src/services/projectService.js
import apiClient from '../utils/axiosConfig';

const API_BASE_URL = '/projects';

export const projectService = {
    getProjects: async () => {
        const response = await apiClient.get(API_BASE_URL);
        return response;
    },
    getProjectById: async (projectId) => {
        const response = await apiClient.get(`${API_BASE_URL}/${projectId}`);
        return response;
    },
    deleteProject: async (projectId) => {
        const response = await apiClient.delete(`${API_BASE_URL}/${projectId}`);
        return response;
    },
    createProject: async (projectData) => {
        const response = await apiClient.post(API_BASE_URL, projectData);
        return response;
    },
    updateProject: async (projectId, projectData) => {
        const response = await apiClient.put(`${API_BASE_URL}/${projectId}`, projectData);
        return response;
    },
    // Add more methods for create, update, delete as needed
};
