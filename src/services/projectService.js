// src/services/projectService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL + '/projects';

const getAuthHeaders = () => {
    const token = localStorage.getItem('timetracker_token') || sessionStorage.getItem('timetracker_token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

export const projectService = {
    getProjects: async () => {
        const response = await axios.get(API_BASE_URL, { headers: getAuthHeaders() });
        return response;
    },
    deleteProject: async (projectId) => {
        const response = await axios.delete(`${API_BASE_URL}/${projectId}`, { headers: getAuthHeaders() });
        return response;
    },
    createProject: async (projectData) => {
        const response = await axios.post(API_BASE_URL, projectData, { headers: getAuthHeaders() });
        return response;
    },
    updateProject: async (projectId, projectData) => {
        const response = await axios.put(`${API_BASE_URL}/${projectId}`, projectData, { headers: getAuthHeaders() });
        return response;
    },
    // Add more methods for create, update, delete as needed
};
