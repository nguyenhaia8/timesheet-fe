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
  deleteEmployee,
  authenticateEmployee,
  registerEmployee
} from '../mock/api/employeeApi';

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
      const response = await authenticateEmployee(username, password);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(registrationData) {
    try {
      const response = await registerEmployee(registrationData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
};

export default employeeService;
