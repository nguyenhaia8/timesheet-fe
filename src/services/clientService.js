// src/services/clientService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL + '/clients';

const getAuthHeaders = () => {
    const token = localStorage.getItem('timetracker_token') || sessionStorage.getItem('timetracker_token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

const getClients = async () => {
    const response = await axios.get(API_BASE_URL, { headers: getAuthHeaders() });
    return response.data;
};

const addClient = async (client) => {
    const response = await axios.post(API_BASE_URL, client, { headers: getAuthHeaders() });
    return response.data;
};

const updateClient = async (client) => {
    const response = await axios.put(`${API_BASE_URL}/${client.clientId}`, client, { headers: getAuthHeaders() });
    return response.data;
};

const deleteClient = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, { headers: getAuthHeaders() });
    return response.data;
};

export default {
    getClients,
    addClient,
    updateClient,
    deleteClient
};
