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

  // Register new employee/user
  async registerEmployee(registrationData) {
    await delay(1500);
    
    if (shouldFail()) {
      throw new MockApiError('Registration service unavailable', 500);
    }

    const {
      firstName,
      lastName,
      email,
      username,
      password,
      phoneNumber,
      departmentId,
      position,
      hireDate,
      employeeId
    } = registrationData;

    // Check if username already exists
    const existingUser = users.find(u => u.userName === username);
    if (existingUser) {
      throw new MockApiError('Username already exists', 409);
    }

    // Check if employee ID already exists
    const existingEmployee = this.data.find(e => e.employeeId === parseInt(employeeId));
    if (existingEmployee) {
      throw new MockApiError('Employee ID already exists', 409);
    }

    // Check if email already exists
    const existingEmail = this.data.find(e => e.email === email);
    if (existingEmail) {
      throw new MockApiError('Email address already exists', 409);
    }

    // Create new employee record
    const newEmployee = {
      employeeId: parseInt(employeeId),
      firstName,
      lastName,
      email,
      phoneNumber: phoneNumber || null,
      departmentId: parseInt(departmentId),
      managerId: null, // Will be assigned later by admin
      position,
      hireDate: hireDate.split('T')[0], // Convert to date string
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Create new user record (inactive until admin approval)
    const newUser = {
      userId: Math.max(...users.map(u => u.userId)) + 1, // Generate new ID
      userName: username,
      password: `$2b$10$${password}`, // Mock password hashing
      employeeId: parseInt(employeeId),
      isActive: false, // Requires admin approval
      lastLogin: null,
      createdAt: new Date().toISOString()
    };

    // Add default Employee role
    const newUserRole = {
      userId: newUser.userId,
      roleId: 1 // Employee role
    };

    // In a real application, these would be persisted to database
    // For mock, we'll just add to arrays temporarily
    this.data.push(newEmployee);
    users.push(newUser);
    userRoles.push(newUserRole);

    return new MockApiResponse({
      employee: newEmployee,
      user: {
        ...newUser,
        password: undefined // Don't return password
      },
      message: 'Registration successful. Account pending approval.',
      requiresApproval: true
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
export const registerEmployee = (registrationData) => employeeApi.registerEmployee(registrationData);

export default employeeApi;
