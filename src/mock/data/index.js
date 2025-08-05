// Export all mock data from a single file
export { employees } from './employees';
export { departments } from './departments';
export { clients } from './clients';
export { projects } from './projects';
export { timesheets, timesheetEntries } from './timesheets';
export { users, roles, userRoles } from './users';
export { approvals, employeeProjects } from './approvals';

// Combined export for easy access
export const mockDatabase = {
  employees: require('./employees').employees,
  departments: require('./departments').departments,
  clients: require('./clients').clients,
  projects: require('./projects').projects,
  timesheets: require('./timesheets').timesheets,
  timesheetEntries: require('./timesheets').timesheetEntries,
  users: require('./users').users,
  roles: require('./users').roles,
  userRoles: require('./users').userRoles,
  approvals: require('./approvals').approvals,
  employeeProjects: require('./approvals').employeeProjects
};

// Database statistics for dashboard
export const getDatabaseStats = () => ({
  totalEmployees: mockDatabase.employees.length,
  totalProjects: mockDatabase.projects.length,
  totalTimesheets: mockDatabase.timesheets.length,
  totalClients: mockDatabase.clients.length,
  pendingApprovals: mockDatabase.approvals.filter(a => a.status === 'Pending').length,
  activeProjects: mockDatabase.projects.filter(p => p.status === 'Active').length
});
