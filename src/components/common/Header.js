import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import './Header.css';

const Header = ({ user, onLogout, onToggleSidebar }) => {
    const start = (
        <div className="flex align-items-center">
            <Button 
                icon="pi pi-bars" 
                className="p-button-text p-button-plain mr-2"
                onClick={onToggleSidebar}
                tooltip="Toggle Menu"
            />
            <img 
                alt="logo" 
                src="/logo192.png" 
                height="32" 
                className="mr-2"
            />
            <span className="text-xl font-bold text-primary">TimeTracker</span>
        </div>
    );

    const end = (
        <div className="flex align-items-center gap-2">
            {/* Notifications */}
            <Button 
                icon="pi pi-bell" 
                className="p-button-text p-button-plain"
                tooltip="Notifications"
            >
                <Badge value="3" className="p-badge-danger" />
            </Button>

            {/* User Profile */}
            <div className="flex align-items-center gap-2">
                <Avatar 
                    label={user?.firstName?.charAt(0) || 'U'} 
                    className="mr-2" 
                    size="normal" 
                    shape="circle" 
                />
                <div className="flex flex-column">
                    <span className="font-medium text-sm">
                        {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-xs text-500">{user?.position}</span>
                </div>
            </div>

            {/* Logout */}
            <Button 
                icon="pi pi-sign-out" 
                className="p-button-text p-button-plain"
                onClick={onLogout}
                tooltip="Logout"
            />
        </div>
    );

    return (
        <div className="header-container">
            <Menubar 
                start={start} 
                end={end}
                className="border-none border-round-0 header-menubar"
            />
        </div>
    );
};

export default Header;
