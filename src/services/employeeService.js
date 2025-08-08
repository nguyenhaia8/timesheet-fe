// Employee Service - currently using mock API
import {
  getEmployees,
  getEmployeeById,
  getEmployeeWithUserInfo,
  getEmployeesByDepartment,
  getManagedEmployees,
  searchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from '../mock/api/employeeApi';

// Real API imports
import { authApi } from '../api/auth';

// Real API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// Helper method to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const employeeService = {
  async getAllEmployees(filters = {}) {
    try {
      const response = await getEmployees(filters);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  async getEmployeeById(employeeId) {
    try {
      const response = await getEmployeeById(employeeId);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  },

  async getEmployeeDetails(employeeId) {
    try {
      const response = await getEmployeeWithUserInfo(employeeId);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee details:', error);
      throw error;
    }
  },

  async getDepartmentEmployees(departmentId) {
    try {
      const response = await getEmployeesByDepartment(departmentId);
      return response.data;
    } catch (error) {
      console.error('Error fetching department employees:', error);
      throw error;
    }
  },

  async getTeamMembers(managerId) {
    try {
      const response = await getManagedEmployees(managerId);
      return response.data;
    } catch (error) {
      console.error('Error fetching team members:', error);
      throw error;
    }
  },

  async searchEmployees(searchTerm) {
    try {
      const response = await searchEmployees(searchTerm);
      return response.data;
    } catch (error) {
      console.error('Error searching employees:', error);
      throw error;
    }
  },

  async createEmployee(employeeData) {
    try {
      const response = await createEmployee(employeeData);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  async updateEmployee(employeeId, employeeData) {
    try {
      const response = await updateEmployee(employeeId, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  async deleteEmployee(employeeId) {
    try {
      const response = await deleteEmployee(employeeId);
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
