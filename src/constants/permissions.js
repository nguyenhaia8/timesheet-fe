// Permission utilities and constants for underscore-based permissions
export const PERMISSIONS = {
  // Timesheet permissions
  VIEW_OWN_TIMESHEET: 'view_own_timesheet',
  CREATE_OWN_TIMESHEET: 'create_own_timesheet',
  EDIT_OWN_TIMESHEET: 'edit_own_timesheet',
  SUBMIT_OWN_TIMESHEET: 'submit_own_timesheet',
  DELETE_OWN_TIMESHEET: 'delete_own_timesheet',
  VIEW_TEAM_TIMESHEET: 'view_team_timesheet',
  EDIT_TEAM_TIMESHEET: 'edit_team_timesheet',
  APPROVE_TEAM_TIMESHEET: 'approve_team_timesheet',
  REJECT_TEAM_TIMESHEET: 'reject_team_timesheet',
  VIEW_ALL_TIMESHEET: 'view_all_timesheet',
  CREATE_ALL_TIMESHEET: 'create_all_timesheet',
  EDIT_ALL_TIMESHEET: 'edit_all_timesheet',
  DELETE_ALL_TIMESHEET: 'delete_all_timesheet',
  APPROVE_ALL_TIMESHEET: 'approve_all_timesheet',
  REJECT_ALL_TIMESHEET: 'reject_all_timesheet',

  // Project permissions
  VIEW_ASSIGNED_PROJECT: 'view_assigned_project',
  VIEW_TEAM_PROJECT: 'view_team_project',
  VIEW_ALL_PROJECT: 'view_all_project',
  CREATE_ALL_PROJECT: 'create_all_project',
  EDIT_ASSIGNED_PROJECT: 'edit_assigned_project',
  EDIT_ALL_PROJECT: 'edit_all_project',
  DELETE_ALL_PROJECT: 'delete_all_project',
  ASSIGN_TEAM_PROJECT: 'assign_team_project',
  ASSIGN_ALL_PROJECT: 'assign_all_project',

  // Employee permissions
  VIEW_TEAM_EMPLOYEE: 'view_team_employee',
  VIEW_ALL_EMPLOYEE: 'view_all_employee',
  CREATE_ALL_EMPLOYEE: 'create_all_employee',
  EDIT_ALL_EMPLOYEE: 'edit_all_employee',
  DELETE_ALL_EMPLOYEE: 'delete_all_employee',

  // Department permissions
  VIEW_ALL_DEPARTMENT: 'view_all_department',
  CREATE_ALL_DEPARTMENT: 'create_all_department',
  EDIT_ALL_DEPARTMENT: 'edit_all_department',
  DELETE_ALL_DEPARTMENT: 'delete_all_department',

  // Client permissions
  VIEW_ALL_CLIENT: 'view_all_client',
  CREATE_ALL_CLIENT: 'create_all_client',
  EDIT_ALL_CLIENT: 'edit_all_client',
  DELETE_ALL_CLIENT: 'delete_all_client',

  // User permissions
  VIEW_ALL_USER: 'view_all_user',
  CREATE_ALL_USER: 'create_all_user',
  EDIT_ALL_USER: 'edit_all_user',
  DELETE_ALL_USER: 'delete_all_user',

  // Role permissions
  VIEW_ALL_ROLE: 'view_all_role',
  CREATE_ALL_ROLE: 'create_all_role',
  EDIT_ALL_ROLE: 'edit_all_role',
  DELETE_ALL_ROLE: 'delete_all_role',

  // Profile permissions
  VIEW_OWN_PROFILE: 'view_own_profile',
  EDIT_OWN_PROFILE: 'edit_own_profile',
  VIEW_ALL_PROFILE: 'view_all_profile',
  EDIT_ALL_PROFILE: 'edit_all_profile',

  // Reports permissions
  VIEW_TEAM_REPORTS: 'view_team_reports',
  GENERATE_TEAM_REPORTS: 'generate_team_reports',
  VIEW_ALL_REPORTS: 'view_all_reports',
  GENERATE_ALL_REPORTS: 'generate_all_reports',
  VIEW_HR_REPORTS: 'view_hr_reports',
  GENERATE_HR_REPORTS: 'generate_hr_reports',
  VIEW_EMPLOYEE_REPORTS: 'view_employee_reports',
  GENERATE_EMPLOYEE_REPORTS: 'generate_employee_reports',

  // Administration permissions
  ACCESS_ADMINISTRATION: 'access_administration',
  SYSTEM_ADMINISTRATION: 'system_administration',
  AUDIT_ADMINISTRATION: 'audit_administration',
  BACKUP_ADMINISTRATION: 'backup_administration'
};

/**
 * Check if a user has a specific permission
 * @param {Array} userPermissions - Array of permission strings
 * @param {string} permission - The permission to check
 * @returns {boolean} - Whether the user has the permission
 */
export const hasPermission = (userPermissions, permission) => {
  if (!Array.isArray(userPermissions)) {
    return false;
  }
  return userPermissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 * @param {Array} userPermissions - Array of permission strings
 * @param {Array} permissions - Array of permissions to check
 * @returns {boolean} - Whether the user has any of the permissions
 */
export const hasAnyPermission = (userPermissions, permissions) => {
  if (!Array.isArray(userPermissions) || !Array.isArray(permissions)) {
    return false;
  }
  return permissions.some(permission => userPermissions.includes(permission));
};

/**
 * Check if user has all of the specified permissions
 * @param {Array} userPermissions - Array of permission strings
 * @param {Array} permissions - Array of permissions to check
 * @returns {boolean} - Whether the user has all of the permissions
 */
export const hasAllPermissions = (userPermissions, permissions) => {
  if (!Array.isArray(userPermissions) || !Array.isArray(permissions)) {
    return false;
  }
  return permissions.every(permission => userPermissions.includes(permission));
};

/**
 * Check if user can access administration features
 * @param {Array} userPermissions - Array of permission strings
 * @returns {boolean} - Whether the user has admin access
 */
export const isAdmin = (userPermissions) => {
  return hasPermission(userPermissions, PERMISSIONS.ACCESS_ADMINISTRATION);
};

/**
 * Check if user is a manager (can approve timesheets)
 * @param {Array} userPermissions - Array of permission strings
 * @returns {boolean} - Whether the user has manager permissions
 */
export const isManager = (userPermissions) => {
  return hasAnyPermission(userPermissions, [
    PERMISSIONS.APPROVE_TEAM_TIMESHEET,
    PERMISSIONS.VIEW_TEAM_TIMESHEET,
    PERMISSIONS.VIEW_TEAM_EMPLOYEE
  ]);
};

/**
 * Check timesheet permissions with scope fallback
 * @param {Array} userPermissions - Array of permission strings
 * @param {string} action - The action (view, create, edit, etc.)
 * @param {string} scope - The preferred scope (own, team, all)
 * @returns {boolean} - Whether the user has the permission
 */
export const hasTimesheetPermission = (userPermissions, action, scope = 'own') => {
  const permissionMap = {
    view: {
      own: PERMISSIONS.VIEW_OWN_TIMESHEET,
      team: PERMISSIONS.VIEW_TEAM_TIMESHEET,
      all: PERMISSIONS.VIEW_ALL_TIMESHEET
    },
    create: {
      own: PERMISSIONS.CREATE_OWN_TIMESHEET,
      all: PERMISSIONS.CREATE_ALL_TIMESHEET
    },
    edit: {
      own: PERMISSIONS.EDIT_OWN_TIMESHEET,
      team: PERMISSIONS.EDIT_TEAM_TIMESHEET,
      all: PERMISSIONS.EDIT_ALL_TIMESHEET
    },
    delete: {
      own: PERMISSIONS.DELETE_OWN_TIMESHEET,
      all: PERMISSIONS.DELETE_ALL_TIMESHEET
    },
    submit: {
      own: PERMISSIONS.SUBMIT_OWN_TIMESHEET
    },
    approve: {
      team: PERMISSIONS.APPROVE_TEAM_TIMESHEET,
      all: PERMISSIONS.APPROVE_ALL_TIMESHEET
    },
    reject: {
      team: PERMISSIONS.REJECT_TEAM_TIMESHEET,
      all: PERMISSIONS.REJECT_ALL_TIMESHEET
    }
  };

  const actionPerms = permissionMap[action];
  if (!actionPerms) return false;

  // Check exact scope first
  if (actionPerms[scope] && hasPermission(userPermissions, actionPerms[scope])) {
    return true;
  }

  // Check for higher scopes (all > team > own)
  if (scope === 'own' || scope === 'team') {
    if (actionPerms.all && hasPermission(userPermissions, actionPerms.all)) {
      return true;
    }
  }
  if (scope === 'own') {
    if (actionPerms.team && hasPermission(userPermissions, actionPerms.team)) {
      return true;
    }
  }

  return false;
};

/**
 * Check project permissions with scope fallback
 * @param {Array} userPermissions - Array of permission strings
 * @param {string} action - The action (view, create, edit, etc.)
 * @param {string} scope - The preferred scope (assigned, team, all)
 * @returns {boolean} - Whether the user has the permission
 */
export const hasProjectPermission = (userPermissions, action, scope = 'assigned') => {
  const permissionMap = {
    view: {
      assigned: PERMISSIONS.VIEW_ASSIGNED_PROJECT,
      team: PERMISSIONS.VIEW_TEAM_PROJECT,
      all: PERMISSIONS.VIEW_ALL_PROJECT
    },
    create: {
      all: PERMISSIONS.CREATE_ALL_PROJECT
    },
    edit: {
      assigned: PERMISSIONS.EDIT_ASSIGNED_PROJECT,
      all: PERMISSIONS.EDIT_ALL_PROJECT
    },
    delete: {
      all: PERMISSIONS.DELETE_ALL_PROJECT
    },
    assign: {
      team: PERMISSIONS.ASSIGN_TEAM_PROJECT,
      all: PERMISSIONS.ASSIGN_ALL_PROJECT
    }
  };

  const actionPerms = permissionMap[action];
  if (!actionPerms) return false;

  // Check exact scope first
  if (actionPerms[scope] && hasPermission(userPermissions, actionPerms[scope])) {
    return true;
  }

  // Check for higher scopes
  if (scope !== 'all' && actionPerms.all && hasPermission(userPermissions, actionPerms.all)) {
    return true;
  }

  return false;
};

/**
 * Generate permission summary for debugging
 * @param {Array} userPermissions - Array of permission strings
 * @returns {Object} - Summary of user's capabilities
 */
export const getPermissionSummary = (userPermissions) => {
  return {
    isAdmin: isAdmin(userPermissions),
    isManager: isManager(userPermissions),
    canViewTimesheets: hasTimesheetPermission(userPermissions, 'view'),
    canCreateTimesheets: hasTimesheetPermission(userPermissions, 'create'),
    canApproveTimesheets: hasTimesheetPermission(userPermissions, 'approve', 'team'),
    canManageEmployees: hasPermission(userPermissions, PERMISSIONS.CREATE_ALL_EMPLOYEE),
    canManageProjects: hasPermission(userPermissions, PERMISSIONS.CREATE_ALL_PROJECT),
    canViewReports: hasAnyPermission(userPermissions, [
      PERMISSIONS.VIEW_TEAM_REPORTS,
      PERMISSIONS.VIEW_ALL_REPORTS,
      PERMISSIONS.VIEW_HR_REPORTS
    ]),
    totalPermissions: userPermissions ? userPermissions.length : 0,
    permissions: userPermissions || []
  };
};
