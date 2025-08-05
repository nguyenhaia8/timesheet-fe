// Employee specific mock API
import { MockApi, MockApiResponse, MockApiError, delay } from './mockApi';
import { employees } from '../data/employees';
import { users, userRoles, roles } from '../data/users';

const shouldFail = () => Math.random() < 0.05;

class EmployeeMockApi extends MockApi {
  constructor() {
    super(employees, 'employee');
  }

  // Get employee with user and role information
  async getEmployeeWithUserInfo(employeeId) {
    await delay(300);
    
    if (shouldFail()) {
      throw new MockApiError('Failed to fetch employee details', 500);
    }

    const employee = this.data.find(e => e.employeeId === employeeId);
    if (!employee) {
      throw new MockApiError('Employee not found', 404);
    }

    // Get user info
    const user = users.find(u => u.employeeId === employeeId);
    
    // Get role info
    let roleInfo = null;
    if (user) {
      const userRole = userRoles.find(ur => ur.userId === user.userId);
      if (userRole) {
        roleInfo = roles.find(r => r.roleId === userRole.roleId);
      }
    }

    return new MockApiResponse({
      ...employee,
      user,
      role: roleInfo
    });
  }

  // Get employees by department
  async getByDepartment(departmentId) {
    await delay(400);
    
    if (shouldFail()) {
      throw new MockApiError('Failed to fetch department employees', 500);
    }

    const departmentEmployees = this.data.filter(e => e.departmentId === departmentId && e.isActive);
    return new MockApiResponse(departmentEmployees);
  }

  // Get employees managed by a manager
  async getManagedEmployees(managerId) {
    await delay(400);
    
    const managedEmployees = this.data.filter(e => e.managerId === managerId && e.isActive);
    return new MockApiResponse(managedEmployees);
  }

  // Search employees
  async searchEmployees(searchTerm) {
    await delay(300);
    
    if (!searchTerm) {
      return new MockApiResponse(this.data.filter(e => e.isActive));
    }

    const searchLower = searchTerm.toLowerCase();
    const filteredEmployees = this.data.filter(e => 
      e.isActive && (
        e.firstName.toLowerCase().includes(searchLower) ||
        e.lastName.toLowerCase().includes(searchLower) ||
        e.email.toLowerCase().includes(searchLower) ||
        e.position.toLowerCase().includes(searchLower)
      )
    );

    return new MockApiResponse(filteredEmployees);
  }

  // Authenticate employee
  async authenticateEmployee(username, password) {
    await delay(800);
    
    if (shouldFail()) {
      throw new MockApiError('Authentication service unavailable', 500);
    }

    const user = users.find(u => u.userName === username && u.isActive);
    
    if (!user) {
      throw new MockApiError('Invalid credentials', 401);
    }

    // In real app, you'd verify password hash
    // For mock, we'll just check if password is not empty
    if (!password || password.length < 3) {
      throw new MockApiError('Invalid credentials', 401);
    }

    const employee = this.data.find(e => e.employeeId === user.employeeId);
    const userRole = userRoles.find(ur => ur.userId === user.userId);
    const role = userRole ? roles.find(r => r.roleId === userRole.roleId) : null;

    // Update last login
    user.lastLogin = new Date().toISOString();

    return new MockApiResponse({
      employee,
      user: {
        ...user,
        password: undefined // Don't return password
      },
      role,
      permissions: role?.permissions || {},
      token: `mock-jwt-token-${user.userId}-${Date.now()}` // Mock JWT token
    });
  }
}

// Create singleton instance
const employeeApi = new EmployeeMockApi();

// Export API functions
export const getEmployees = (filters) => employeeApi.getAll(filters);
export const getEmployeeById = (id) => employeeApi.getById(id);
export const getEmployeeWithUserInfo = (id) => employeeApi.getEmployeeWithUserInfo(id);
export const getEmployeesByDepartment = (departmentId) => employeeApi.getByDepartment(departmentId);
export const getManagedEmployees = (managerId) => employeeApi.getManagedEmployees(managerId);
export const searchEmployees = (searchTerm) => employeeApi.searchEmployees(searchTerm);
export const createEmployee = (data) => employeeApi.create(data);
export const updateEmployee = (id, data) => employeeApi.update(id, data);
export const deleteEmployee = (id) => employeeApi.delete(id);
export const authenticateEmployee = (username, password) => employeeApi.authenticateEmployee(username, password);

export default employeeApi;
