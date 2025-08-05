// Mock user and role data
export const users = [
  {
    userId: 1,
    userName: 'john.doe',
    password: '$2b$10$hashedPassword1', // In real app, passwords would be hashed
    employeeId: 1,
    isActive: true,
    lastLogin: '2025-02-03T08:30:00Z',
    createdAt: '2022-01-15T09:00:00Z'
  },
  {
    userId: 2,
    userName: 'jane.smith',
    password: '$2b$10$hashedPassword2',
    employeeId: 2,
    isActive: true,
    lastLogin: '2025-02-03T09:15:00Z',
    createdAt: '2022-03-10T09:00:00Z'
  },
  {
    userId: 3,
    userName: 'mike.johnson',
    password: '$2b$10$hashedPassword3',
    employeeId: 3,
    isActive: true,
    lastLogin: '2025-02-03T07:45:00Z',
    createdAt: '2021-06-01T09:00:00Z'
  },
  {
    userId: 4,
    userName: 'sarah.williams',
    password: '$2b$10$hashedPassword4',
    employeeId: 4,
    isActive: true,
    lastLogin: '2025-02-02T16:20:00Z',
    createdAt: '2021-09-20T09:00:00Z'
  },
  {
    userId: 5,
    userName: 'david.brown',
    password: '$2b$10$hashedPassword5',
    employeeId: 5,
    isActive: true,
    lastLogin: '2025-02-03T08:00:00Z',
    createdAt: '2020-04-12T09:00:00Z'
  }
];

export const roles = [
  {
    roleId: 1,
    roleName: 'Employee',
    description: 'Basic employee access - can manage own timesheets',
    permissions: [
      'timesheet.view.own',
      'timesheet.create.own',
      'timesheet.edit.own',
      'timesheet.submit.own',
      'project.view.assigned',
      'profile.view.own',
      'profile.edit.own'
    ]
  },
  {
    roleId: 2,
    roleName: 'Manager',
    description: 'Team manager access - can approve team timesheets',
    permissions: [
      'timesheet.view.own',
      'timesheet.create.own',
      'timesheet.edit.own',
      'timesheet.submit.own',
      'timesheet.view.team',
      'timesheet.approve.team',
      'timesheet.reject.team',
      'employee.view.team',
      'project.view.all',
      'project.assign.team',
      'report.view.team',
      'profile.view.own',
      'profile.edit.own'
    ]
  },
  {
    roleId: 3,
    roleName: 'Admin',
    description: 'System administrator - full access to all features',
    permissions: [
      'timesheet.*',
      'employee.*',
      'department.*',
      'project.*',
      'client.*',
      'user.*',
      'role.*',
      'report.*',
      'system.*'
    ]
  },
  {
    roleId: 4,
    roleName: 'HR',
    description: 'Human Resources - employee and department management',
    permissions: [
      'employee.view.all',
      'employee.create',
      'employee.edit.all',
      'department.view.all',
      'department.create',
      'department.edit.all',
      'user.view.all',
      'user.create',
      'user.edit.all',
      'report.view.hr',
      'timesheet.view.all'
    ]
  }
];

// User-Role assignments
export const userRoles = [
  { userId: 1, roleId: 1 }, // John Doe - Employee
  { userId: 2, roleId: 1 }, // Jane Smith - Employee
  { userId: 3, roleId: 2 }, // Mike Johnson - Manager
  { userId: 4, roleId: 2 }, // Sarah Williams - Manager
  { userId: 5, roleId: 3 }  // David Brown - Admin
];

export default { users, roles, userRoles };
