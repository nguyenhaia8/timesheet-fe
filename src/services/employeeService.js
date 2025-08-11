// Employee Service - currently using mock API

import apiClient from '../utils/axiosConfig';
import { authApi } from '../api/auth';

const API_BASE_URL = '/employees';

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
      const response = await apiClient.get(API_BASE_URL, {
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
      const response = await apiClient.get(`${API_BASE_URL}/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  },

  async getEmployeeDetails(employeeId) {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/${employeeId}/details`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee details:', error);
      throw error;
    }
  },

  async getDepartmentEmployees(departmentId) {
    try {
      const response = await apiClient.get(`${API_BASE_URL}?departmentId=${departmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching department employees:', error);
      throw error;
    }
  },

  async getTeamMembers(managerId) {
    try {
      const response = await apiClient.get(`${API_BASE_URL}?managerId=${managerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },

  async searchEmployees(searchTerm) {
    try {
      const response = await apiClient.get(`${API_BASE_URL}?search=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching employees:', error);
      throw error;
    }
  },

  async createEmployee(employeeData) {
    try {
      const response = await apiClient.post(API_BASE_URL, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  async updateEmployee(employeeId, employeeData) {
    try {
      const response = await apiClient.put(`${API_BASE_URL}/${employeeId}`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  async deleteEmployee(employeeId) {
    try {
      const response = await apiClient.delete(`${API_BASE_URL}/${employeeId}`);
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
      // Use authApi for registration
      const response = await authApi.register(registrationData);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
};

export default employeeService;
