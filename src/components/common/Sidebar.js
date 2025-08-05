import React from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import { usePermissions } from '../../hooks/usePermissions';
import './Sidebar.css';

const Sidebar = ({ isVisible, user }) => {
    const permissions = usePermissions(user);

    // Define menu items based on user permissions
    const getMenuItems = () => {
        const commonItems = [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                command: () => navigate('/dashboard')
            }
        ];

        // Timesheet section - always available to logged-in users
        if (permissions.canViewTimesheets()) {
            commonItems.push({
                label: 'My Timesheets',
                icon: 'pi pi-fw pi-clock',
                items: [
                    {
                        label: 'Current Timesheet',
                        icon: 'pi pi-fw pi-calendar-plus',
                        command: () => navigate('/timesheet/current')
                    },
                    {
                        label: 'All Timesheets',
                        icon: 'pi pi-fw pi-list',
                        command: () => navigate('/timesheets')
                    },
                    ...(permissions.canCreateTimesheets() ? [{
                        label: 'Create New',
                        icon: 'pi pi-fw pi-plus',
                        command: () => navigate('/timesheet/create')
                    }] : [])
                ]
            });
        }

        // Projects section
        if (permissions.canViewProjects()) {
            const projectItems = [
                {
                    label: 'My Projects',
                    icon: 'pi pi-fw pi-folder',
                    command: () => navigate('/projects/my')
                }
            ];

            // Add "All Projects" if user can view beyond assigned projects
            if (permissions.canViewAllProjects() || permissions.canViewTeamProjects()) {
                projectItems.push({
                    label: 'All Projects',
                    icon: 'pi pi-fw pi-folder-open',
                    command: () => navigate('/projects')
                });
            }

            // Add project creation if user has permission
            if (permissions.canCreateProjects()) {
                projectItems.push({
                    label: 'Create Project',
                    icon: 'pi pi-fw pi-plus',
                    command: () => navigate('/projects/create')
                });
            }

            commonItems.push({
                label: 'Projects',
                icon: 'pi pi-fw pi-briefcase',
                items: projectItems
            });
        }

        // Team Management section - for managers
        if (permissions.isManager() && !permissions.isAdmin()) {
            commonItems.push({
                label: 'Team Management',
                icon: 'pi pi-fw pi-users',
                items: [
                    ...(permissions.canViewTeamEmployees() ? [{
                        label: 'My Team',
                        icon: 'pi pi-fw pi-user-plus',
                        command: () => navigate('/team')
                    }] : []),
                    ...(permissions.canApproveTimesheets() ? [{
                        label: 'Approval Queue',
                        icon: 'pi pi-fw pi-check-circle',
                        command: () => navigate('/approvals')
                    }] : []),
                    ...(permissions.canViewTeamReports() ? [{
                        label: 'Team Reports',
                        icon: 'pi pi-fw pi-chart-line',
                        command: () => navigate('/reports/team')
                    }] : [])
                ]
            });
        }

        // Administration section - for admins
        if (permissions.isAdmin()) {
            const adminItems = [];

            if (permissions.canViewAllEmployees()) {
                adminItems.push({
                    label: 'Employees',
                    icon: 'pi pi-fw pi-users',
                    command: () => navigate('/admin/employees')
                });
            }

            if (permissions.canViewDepartments()) {
                adminItems.push({
                    label: 'Departments',
                    icon: 'pi pi-fw pi-building',
                    command: () => navigate('/admin/departments')
                });
            }

            if (permissions.canViewAllProjects()) {
                adminItems.push({
                    label: 'Projects',
                    icon: 'pi pi-fw pi-briefcase',
                    command: () => navigate('/admin/projects')
                });
            }

            if (permissions.canViewClients()) {
                adminItems.push({
                    label: 'Clients',
                    icon: 'pi pi-fw pi-id-card',
                    command: () => navigate('/admin/clients')
                });
            }

            if (permissions.canViewRoles()) {
                adminItems.push({
                    label: 'Roles & Permissions',
                    icon: 'pi pi-fw pi-key',
                    command: () => navigate('/admin/roles')
                });
            }

            if (adminItems.length > 0) {
                commonItems.push({
                    label: 'Administration',
                    icon: 'pi pi-fw pi-cog',
                    items: adminItems
                });
            }
        }

        // Reports section
        if (permissions.canViewReports()) {
            const reportItems = [];

            if (permissions.canViewAllReports() || permissions.canViewTeamReports()) {
                reportItems.push(
                    {
                        label: 'Time Reports',
                        icon: 'pi pi-fw pi-chart-line',
                        command: () => navigate('/reports/time')
                    },
                    {
                        label: 'Project Reports',
                        icon: 'pi pi-fw pi-chart-pie',
                        command: () => navigate('/reports/projects')
                    }
                );
            }

            if (permissions.canViewAllReports()) {
                reportItems.push({
                    label: 'Employee Reports',
                    icon: 'pi pi-fw pi-users',
                    command: () => navigate('/reports/employees')
                });
            }

            if (reportItems.length > 0) {
                commonItems.push({
                    label: 'Reports',
                    icon: 'pi pi-fw pi-chart-bar',
                    items: reportItems
                });
            }
        }

        // Always add settings and profile
        commonItems.push(
            {
                separator: true
            },
            {
                label: 'Settings',
                icon: 'pi pi-fw pi-cog',
                command: () => navigate('/settings')
            },
            {
                label: 'Profile',
                icon: 'pi pi-fw pi-user',
                command: () => navigate('/profile')
            }
        );

        return commonItems;
    };

    // Mock navigate function - replace with actual router navigation
    const navigate = (path) => {
        console.log('Navigate to:', path);
        // Replace with your routing logic
        // Example: history.push(path) or navigate(path) for React Router
    };

    return (
        <div className={`sidebar ${isVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <i className="pi pi-clock text-2xl text-primary"></i>
                    <span className="sidebar-title">TimeTracker</span>
                </div>
            </div>
            
            <div className="sidebar-content">
                <PanelMenu 
                    model={getMenuItems()} 
                    className="sidebar-menu"
                />
            </div>

            <div className="sidebar-footer">
                <div className="text-xs text-500 text-center p-2">
                    © 2025 TimeTracker App
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
