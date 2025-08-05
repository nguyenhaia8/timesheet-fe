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
      'view_own_timesheet',
      'create_own_timesheet',
      'edit_own_timesheet',
      'submit_own_timesheet',
      'view_assigned_project',
      'view_own_profile',
      'edit_own_profile'
    ]
  },
  {
    roleId: 2,
    roleName: 'Manager',
    description: 'Team manager access - can approve team timesheets',
    permissions: [
      'view_own_timesheet',
      'create_own_timesheet',
      'edit_own_timesheet',
      'submit_own_timesheet',
      'view_team_timesheet',
      'approve_team_timesheet',
      'reject_team_timesheet',
      'view_all_project',
      'edit_assigned_project',
      'assign_team_project',
      'view_team_employee',
      'view_own_profile',
      'edit_own_profile',
      'view_team_reports',
      'generate_team_reports'
    ]
  },
  {
    roleId: 3,
    roleName: 'Admin',
    description: 'System administrator - full access to all features',
    permissions: [
      'view_all_timesheet',
      'create_all_timesheet',
      'edit_all_timesheet',
      'submit_all_timesheet',
      'delete_all_timesheet',
      'approve_all_timesheet',
      'reject_all_timesheet',
      'view_all_project',
      'create_all_project',
      'edit_all_project',
      'delete_all_project',
      'assign_all_project',
      'view_all_employee',
      'create_all_employee',
      'edit_all_employee',
      'delete_all_employee',
      'view_all_department',
      'create_all_department',
      'edit_all_department',
      'delete_all_department',
      'view_all_client',
      'create_all_client',
      'edit_all_client',
      'delete_all_client',
      'view_all_user',
      'create_all_user',
      'edit_all_user',
      'delete_all_user',
      'view_all_role',
      'create_all_role',
      'edit_all_role',
      'delete_all_role',
      'view_all_profile',
      'edit_all_profile',
      'view_all_reports',
      'generate_all_reports',
      'access_administration',
      'system_administration',
      'audit_administration',
      'backup_administration'
    ]
  },
  {
    roleId: 4,
    roleName: 'HR',
    description: 'Human Resources - employee and department management',
    permissions: [
      'view_all_timesheet',
      'view_all_project',
      'view_all_employee',
      'create_all_employee',
      'edit_all_employee',
      'delete_all_employee',
      'view_all_department',
      'create_all_department',
      'edit_all_department',
      'delete_all_department',
      'view_all_user',
      'create_all_user',
      'edit_all_user',
      'delete_all_user',
      'view_all_role',
      'view_all_profile',
      'edit_own_profile',
      'view_hr_reports',
      'generate_hr_reports',
      'view_employee_reports',
      'generate_employee_reports'
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
