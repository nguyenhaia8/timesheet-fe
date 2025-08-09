import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PanelMenu } from 'primereact/panelmenu';
import { usePermissions } from '../../hooks/usePermissions';
import './Sidebar.css';

const Sidebar = ({ isVisible, user }) => {
    const permissions = usePermissions(user);
    const navigate = useNavigate();

    // Define menu items based on user permissions
    const getMenuItems = () => [
        {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            command: () => navigate('/dashboard')
        },
        {
            label: 'My Timesheet',
            icon: 'pi pi-fw pi-clock',
            command: () => navigate('/timesheets')
        },
        {
            label: 'Tasks',
            icon: 'pi pi-fw pi-list',
            command: () => navigate('/tasks')
        },
        {
            label: 'Projects',
            icon: 'pi pi-fw pi-briefcase',
            command: () => navigate('/projects')
        },
        {
            label: 'Departments',
            icon: 'pi pi-fw pi-building',
            command: () => navigate('/departments')
        },
        {
            label: 'Employees',
            icon: 'pi pi-fw pi-users',
            command: () => navigate('/employees')
        },
        {
            label: 'Clients',
            icon: 'pi pi-fw pi-id-card',
            command: () => navigate('/clients')
        },
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
    ];

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
