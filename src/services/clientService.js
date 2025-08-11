// src/services/clientService.js
import apiClient from '../utils/axiosConfig';

const API_BASE_URL = '/clients';

const getClients = async () => {
    const response = await apiClient.get(API_BASE_URL);
    return response.data;
};

const addClient = async (client) => {
    const response = await apiClient.post(API_BASE_URL, client);
    return response.data;
};

const updateClient = async (client) => {
    const response = await apiClient.put(`${API_BASE_URL}/${client.clientId}`, client);
    return response.data;
};

const deleteClient = async (id) => {
    const response = await apiClient.delete(`${API_BASE_URL}/${id}`);
    return response.data;
};

export default {
    getClients,
    addClient,
    updateClient,
    deleteClient
};
