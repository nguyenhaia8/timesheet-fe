import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children, user, onLogout }) => {
    const [sidebarVisible, setSidebarVisible] = useState(true);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <div className="layout-container">
            <Header 
                user={user}
                onLogout={onLogout}
                onToggleSidebar={toggleSidebar}
            />
            
            <Sidebar 
                isVisible={sidebarVisible}
                userRole={user?.role}
            />
            
            <main className={`main-content ${sidebarVisible ? 'main-content-sidebar-visible' : 'main-content-sidebar-hidden'}`}>
                <div className="content-wrapper">
                    {children}
                </div>
            </main>
            
            {/* Overlay for mobile when sidebar is open */}
            {sidebarVisible && (
                <div 
                    className="sidebar-overlay"
                    onClick={() => setSidebarVisible(false)}
                />
            )}
        </div>
    );
};

export default Layout;
