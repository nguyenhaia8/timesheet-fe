import { useMemo } from 'react';
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  hasTimesheetPermission,
  hasProjectPermission,
  isAdmin,
  isManager,
  getPermissionSummary,
  PERMISSIONS
} from '../constants/permissions';

/**
 * Custom hook for handling user permissions with underscore-based permission array
 * @param {Object} user - User object with role and permissions
 * @returns {Object} - Permission checking functions and utilities
 */
export const usePermissions = (user) => {
  const permissions = useMemo(() => {
    return user?.role?.permissions || user?.permissions || [];
  }, [user]);

  const permissionUtils = useMemo(() => ({
    // Direct permission checking
    hasPermission: (permission) => 
      hasPermission(permissions, permission),

    hasAnyPermission: (permissionArray) => 
      hasAnyPermission(permissions, permissionArray),

    hasAllPermissions: (permissionArray) => 
      hasAllPermissions(permissions, permissionArray),

    // Timesheet permissions with scope checking
    hasTimesheetPermission: (action, scope = 'own') =>
      hasTimesheetPermission(permissions, action, scope),

    // Project permissions with scope checking
    hasProjectPermission: (action, scope = 'assigned') =>
      hasProjectPermission(permissions, action, scope),

    // Role-based checks
    isAdmin: () => isAdmin(permissions),
    isManager: () => isManager(permissions),

    // Common permission checks for timesheet app
    canViewOwnTimesheet: () => 
      hasPermission(permissions, PERMISSIONS.VIEW_OWN_TIMESHEET),

    canViewTeamTimesheet: () => 
      hasPermission(permissions, PERMISSIONS.VIEW_TEAM_TIMESHEET),

    canViewAllTimesheet: () => 
      hasPermission(permissions, PERMISSIONS.VIEW_ALL_TIMESHEET),

    canViewTimesheets: (scope = 'own') => 
      hasTimesheetPermission(permissions, 'view', scope),

    canCreateTimesheets: (scope = 'own') => 
      hasTimesheetPermission(permissions, 'create', scope),

    canEditTimesheet: (scope = 'own') => 
      hasTimesheetPermission(permissions, 'edit', scope),

    canDeleteTimesheet: (scope = 'own') => 
      hasTimesheetPermission(permissions, 'delete', scope),

    canSubmitTimesheet: () => 
      hasPermission(permissions, PERMISSIONS.SUBMIT_OWN_TIMESHEET),

    canApproveTimesheets: (scope = 'team') => 
      hasTimesheetPermission(permissions, 'approve', scope),

    canRejectTimesheets: (scope = 'team') => 
      hasTimesheetPermission(permissions, 'reject', scope),

    // Approval permissions
    canViewApprovals: () => 
      hasAnyPermission(permissions, [
        PERMISSIONS.APPROVE_TEAM_TIMESHEET,
        PERMISSIONS.APPROVE_ALL_TIMESHEET,
        PERMISSIONS.REJECT_TEAM_TIMESHEET,
        PERMISSIONS.REJECT_ALL_TIMESHEET
      ]) || isManager(permissions) || isAdmin(permissions),

    // Project permissions
    canViewAssignedProjects: () => 
      hasPermission(permissions, PERMISSIONS.VIEW_ASSIGNED_PROJECT),

    canViewTeamProjects: () => 
      hasPermission(permissions, PERMISSIONS.VIEW_TEAM_PROJECT),

    canViewAllProjects: () => 
      hasPermission(permissions, PERMISSIONS.VIEW_ALL_PROJECT),

    canViewProjects: (scope = 'assigned') => 
      hasProjectPermission(permissions, 'view', scope),

    canCreateProjects: () => 
      hasPermission(permissions, PERMISSIONS.CREATE_ALL_PROJECT),

    canEditProject: (scope = 'assigned') => 
      hasProjectPermission(permissions, 'edit', scope),

    canDeleteProject: () => 
      hasPermission(permissions, PERMISSIONS.DELETE_ALL_PROJECT),

    canAssignProjects: (scope = 'team') => 
      hasProjectPermission(permissions, 'assign', scope),

    // Employee permissions
    canViewTeamEmployees: () => 
      hasPermission(permissions, PERMISSIONS.VIEW_TEAM_EMPLOYEE),

    canViewAllEmployees: () => 
      hasPermission(permissions, PERMISSIONS.VIEW_ALL_EMPLOYEE),

    canViewEmployees: () => 
      hasAnyPermission(permissions, [
        PERMISSIONS.VIEW_TEAM_EMPLOYEE,
        PERMISSIONS.VIEW_ALL_EMPLOYEE
      ]),

    canCreateEmployees: () => 
      hasPermission(permissions, PERMISSIONS.CREATE_ALL_EMPLOYEE),

    canEditEmployee: () => 
      hasPermission(permissions, PERMISSIONS.EDIT_ALL_EMPLOYEE),

    canDeleteEmployee: () => 
      hasPermission(permissions, PERMISSIONS.DELETE_ALL_EMPLOYEE),

    // Department permissions
    canViewDepartments: () => 
      hasPermission(permissions, PERMISSIONS.VIEW_ALL_DEPARTMENT),

    canCreateDepartments: () => 
      hasPermission(permissions, PERMISSIONS.CREATE_ALL_DEPARTMENT),

    canEditDepartment: () => 
      hasPermission(permissions, PERMISSIONS.EDIT_ALL_DEPARTMENT),

    canDeleteDepartment: () => 
      hasPermission(permissions, PERMISSIONS.DELETE_ALL_DEPARTMENT),

    canManageDepartments: () => 
      hasPermission(permissions, PERMISSIONS.CREATE_ALL_DEPARTMENT),

    // Client permissions
    canViewClients: () => 
      hasPermission(permissions, PERMISSIONS.VIEW_ALL_CLIENT),

    canCreateClients: () => 
      hasPermission(permissions, PERMISSIONS.CREATE_ALL_CLIENT),

    canEditClient: () => 
      hasPermission(permissions, PERMISSIONS.EDIT_ALL_CLIENT),

    canDeleteClient: () => 
      hasPermission(permissions, PERMISSIONS.DELETE_ALL_CLIENT),

    canManageClients: () => 
      hasPermission(permissions, PERMISSIONS.CREATE_ALL_CLIENT),

    // User permissions
    canViewUsers: () => 
      hasPermission(permissions, PERMISSIONS.VIEW_ALL_USER),

    canCreateUsers: () => 
      hasPermission(permissions, PERMISSIONS.CREATE_ALL_USER),

    canEditUser: () => 
      hasPermission(permissions, PERMISSIONS.EDIT_ALL_USER),

    canDeleteUser: () => 
      hasPermission(permissions, PERMISSIONS.DELETE_ALL_USER),

    canManageUsers: () => 
      hasPermission(permissions, PERMISSIONS.CREATE_ALL_USER),

    // Role permissions
    canViewRoles: () => 
      hasPermission(permissions, PERMISSIONS.VIEW_ALL_ROLE),

    canCreateRoles: () => 
      hasPermission(permissions, PERMISSIONS.CREATE_ALL_ROLE),

    canEditRole: () => 
      hasPermission(permissions, PERMISSIONS.EDIT_ALL_ROLE),

    canDeleteRole: () => 
      hasPermission(permissions, PERMISSIONS.DELETE_ALL_ROLE),

    canManageRoles: () => 
      hasPermission(permissions, PERMISSIONS.CREATE_ALL_ROLE),

    // Profile permissions
    canViewOwnProfile: () => 
      hasPermission(permissions, PERMISSIONS.VIEW_OWN_PROFILE),

    canEditOwnProfile: () => 
      hasPermission(permissions, PERMISSIONS.EDIT_OWN_PROFILE),

    canViewAllProfiles: () => 
      hasPermission(permissions, PERMISSIONS.VIEW_ALL_PROFILE),

    canEditAllProfiles: () => 
      hasPermission(permissions, PERMISSIONS.EDIT_ALL_PROFILE),

    // Reports permissions
    canViewTeamReports: () => 
      hasPermission(permissions, PERMISSIONS.VIEW_TEAM_REPORTS),

    canViewAllReports: () => 
      hasPermission(permissions, PERMISSIONS.VIEW_ALL_REPORTS),

    canViewHRReports: () => 
      hasPermission(permissions, PERMISSIONS.VIEW_HR_REPORTS),

    canViewEmployeeReports: () => 
      hasPermission(permissions, PERMISSIONS.VIEW_EMPLOYEE_REPORTS),

    canViewReports: () => 
      hasAnyPermission(permissions, [
        PERMISSIONS.VIEW_TEAM_REPORTS,
        PERMISSIONS.VIEW_ALL_REPORTS,
        PERMISSIONS.VIEW_HR_REPORTS,
        PERMISSIONS.VIEW_EMPLOYEE_REPORTS
      ]),

    canGenerateTeamReports: () => 
      hasPermission(permissions, PERMISSIONS.GENERATE_TEAM_REPORTS),

    canGenerateAllReports: () => 
      hasPermission(permissions, PERMISSIONS.GENERATE_ALL_REPORTS),

    canGenerateHRReports: () => 
      hasPermission(permissions, PERMISSIONS.GENERATE_HR_REPORTS),

    canGenerateEmployeeReports: () => 
      hasPermission(permissions, PERMISSIONS.GENERATE_EMPLOYEE_REPORTS),

    canGenerateReports: () => 
      hasAnyPermission(permissions, [
        PERMISSIONS.GENERATE_TEAM_REPORTS,
        PERMISSIONS.GENERATE_ALL_REPORTS,
        PERMISSIONS.GENERATE_HR_REPORTS,
        PERMISSIONS.GENERATE_EMPLOYEE_REPORTS
      ]),

    // Administration permissions
    canAccessAdministration: () => 
      hasPermission(permissions, PERMISSIONS.ACCESS_ADMINISTRATION),

    canSystemAdministration: () => 
      hasPermission(permissions, PERMISSIONS.SYSTEM_ADMINISTRATION),

    canAuditAdministration: () => 
      hasPermission(permissions, PERMISSIONS.AUDIT_ADMINISTRATION),

    canBackupAdministration: () => 
      hasPermission(permissions, PERMISSIONS.BACKUP_ADMINISTRATION),

    // Get summary for debugging/UI
    getSummary: () => getPermissionSummary(permissions),

    // Raw permissions array
    getRawPermissions: () => permissions,

    // Get total permissions count
    getPermissionCount: () => Array.isArray(permissions) ? permissions.length : 0
  }), [permissions]);

  return permissionUtils;
};

export default usePermissions;
