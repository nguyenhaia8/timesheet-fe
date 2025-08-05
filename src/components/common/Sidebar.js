import React from 'react';
import { PanelMenu } from 'primereact/panelmenu';
import './Sidebar.css';

const Sidebar = ({ isVisible, userRole }) => {
    // Define menu items based on user role
    const getMenuItems = () => {
        const commonItems = [
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                command: () => navigate('/dashboard')
            },
            {
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
                    {
                        label: 'Create New',
                        icon: 'pi pi-fw pi-plus',
                        command: () => navigate('/timesheet/create')
                    }
                ]
            },
            {
                label: 'Projects',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'My Projects',
                        icon: 'pi pi-fw pi-folder',
                        command: () => navigate('/projects/my')
                    },
                    {
                        label: 'All Projects',
                        icon: 'pi pi-fw pi-folder-open',
                        command: () => navigate('/projects')
                    }
                ]
            }
        ];

        // Add manager/admin specific items
        if (userRole === 'manager' || userRole === 'admin') {
            commonItems.push(
                {
                    label: 'Team Management',
                    icon: 'pi pi-fw pi-users',
                    items: [
                        {
                            label: 'My Team',
                            icon: 'pi pi-fw pi-user-plus',
                            command: () => navigate('/team')
                        },
                        {
                            label: 'Approval Queue',
                            icon: 'pi pi-fw pi-check-circle',
                            command: () => navigate('/approvals')
                        }
                    ]
                }
            );
        }

        // Add admin specific items
        if (userRole === 'admin') {
            commonItems.push(
                {
                    label: 'Administration',
                    icon: 'pi pi-fw pi-cog',
                    items: [
                        {
                            label: 'Employees',
                            icon: 'pi pi-fw pi-users',
                            command: () => navigate('/admin/employees')
                        },
                        {
                            label: 'Departments',
                            icon: 'pi pi-fw pi-building',
                            command: () => navigate('/admin/departments')
                        },
                        {
                            label: 'Projects',
                            icon: 'pi pi-fw pi-briefcase',
                            command: () => navigate('/admin/projects')
                        },
                        {
                            label: 'Clients',
                            icon: 'pi pi-fw pi-id-card',
                            command: () => navigate('/admin/clients')
                        },
                        {
                            label: 'Roles & Permissions',
                            icon: 'pi pi-fw pi-key',
                            command: () => navigate('/admin/roles')
                        }
                    ]
                },
                {
                    label: 'Reports',
                    icon: 'pi pi-fw pi-chart-bar',
                    items: [
                        {
                            label: 'Time Reports',
                            icon: 'pi pi-fw pi-chart-line',
                            command: () => navigate('/reports/time')
                        },
                        {
                            label: 'Project Reports',
                            icon: 'pi pi-fw pi-chart-pie',
                            command: () => navigate('/reports/projects')
                        },
                        {
                            label: 'Employee Reports',
                            icon: 'pi pi-fw pi-users',
                            command: () => navigate('/reports/employees')
                        }
                    ]
                }
            );
        }

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
