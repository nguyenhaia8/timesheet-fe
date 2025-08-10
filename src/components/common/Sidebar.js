import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PanelMenu } from 'primereact/panelmenu';
// import { usePermissions } from '../../hooks/usePermissions';
import './Sidebar.css';

const Sidebar = ({ isVisible, user }) => {
    // const permissions = usePermissions(user);
    const navigate = useNavigate();

    // Define menu items based on logged-in user's roles
    const getMenuItems = () => {
        const roles = user?.roles || [];
        const items = [];

        // Show all resources for all roles the user has
        if (roles.includes('ROLE_ADMIN')) {
            items.push({ label: 'Dashboard', icon: 'pi pi-fw pi-home', command: () => navigate('/dashboard') });
            items.push({ label: 'My Timesheet', icon: 'pi pi-fw pi-clock', command: () => navigate('/timesheets') });
            items.push({ label: 'Approvals', icon: 'pi pi-fw pi-list', command: () => navigate('/approvals') });
            items.push({ label: 'Projects', icon: 'pi pi-fw pi-briefcase', command: () => navigate('/projects') });
            items.push({ label: 'Departments', icon: 'pi pi-fw pi-building', command: () => navigate('/admin/departments') });
            items.push({ label: 'Employees', icon: 'pi pi-fw pi-users', command: () => navigate('/admin/employees') });
            items.push({ label: 'Clients', icon: 'pi pi-fw pi-id-card', command: () => navigate('/clients') });
        }
        if (roles.includes('ROLE_MANAGER')) {
            if (!items.some(item => item.label === 'Dashboard')) items.push({ label: 'Dashboard', icon: 'pi pi-fw pi-home', command: () => navigate('/dashboard') });
            if (!items.some(item => item.label === 'My Timesheet')) items.push({ label: 'My Timesheet', icon: 'pi pi-fw pi-clock', command: () => navigate('/timesheets') });
            if (!items.some(item => item.label === 'Approvals')) items.push({ label: 'Approvals', icon: 'pi pi-fw pi-list', command: () => navigate('/approvals') });
        }
        if (roles.includes('ROLE_EMPLOYEE')) {
            if (!items.some(item => item.label === 'Dashboard')) items.push({ label: 'Dashboard', icon: 'pi pi-fw pi-home', command: () => navigate('/dashboard') });
            if (!items.some(item => item.label === 'My Timesheet')) items.push({ label: 'My Timesheet', icon: 'pi pi-fw pi-clock', command: () => navigate('/timesheets') });
        }

        items.push({ separator: true });
        items.push({ label: 'Settings', icon: 'pi pi-fw pi-cog', command: () => navigate('/settings') });
        items.push({ label: 'Profile', icon: 'pi pi-fw pi-user', command: () => navigate('/profile') });

        return items;
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
