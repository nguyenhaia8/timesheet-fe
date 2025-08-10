// Employee Service - currently using mock API

import axios from 'axios';
import { authApi } from '../api/auth';

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api') + '/employees';

const getAuthHeaders = () => {
  const token = localStorage.getItem('timetracker_token') || sessionStorage.getItem('timetracker_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const employeeService = {
  async getAllEmployees({ page = 1, limit = 10, filters = {}, search = '' } = {}) {
    try {
      // Build query params for pagination, filters, and search
      const params = { page, limit, search };
      // Flatten filters for backend
      Object.keys(filters).forEach(key => {
        if (filters[key]?.value != null) {
          params[key] = filters[key].value;
        }
      });
      const response = await axios.get(API_BASE_URL, {
        headers: getAuthHeaders(),
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  async getEmployeeById(employeeId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/${employeeId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  },

  async getEmployeeDetails(employeeId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/${employeeId}/details`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching employee details:', error);
      throw error;
    }
  },

  async getDepartmentEmployees(departmentId) {
    try {
      const response = await axios.get(`${API_BASE_URL}?departmentId=${departmentId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching department employees:', error);
      throw error;
    }
  },

  async getTeamMembers(managerId) {
    try {
      const response = await axios.get(`${API_BASE_URL}?managerId=${managerId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },

  async searchEmployees(searchTerm) {
    try {
      const response = await axios.get(`${API_BASE_URL}?search=${encodeURIComponent(searchTerm)}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error searching employees:', error);
      throw error;
    }
  },

  async createEmployee(employeeData) {
    try {
      const response = await axios.post(API_BASE_URL, employeeData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  async updateEmployee(employeeId, employeeData) {
    try {
      const response = await axios.put(`${API_BASE_URL}/${employeeId}`, employeeData, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  async deleteEmployee(employeeId) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${employeeId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  },

  async login(username, password) {
    try {
      // Use real API for login
      const response = await authApi.login({ 
        userName: username, 
        password: password 
      });
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(registrationData) {
    try {
      // Use real API endpoint for registration
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(registrationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
};

export default employeeService;
