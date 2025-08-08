import React, { useState } from 'react';
import EmployeeList from './EmployeeList';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';

const EmployeeManagement = () => {
    const { user } = useAuth();
    const permissions = usePermissions(user);
    const [triggerCreate, setTriggerCreate] = useState(0);

    const handleAddEmployee = () => {
        setTriggerCreate(prev => prev + 1);
    };

    // Check if user has permission to view employees
    if (!permissions.canViewEmployees()) {
        return (
            <div className="card">
                <Message
                    severity="warn"
                    text="You do not have permission to view employee information."
                />
            </div>
        );
    }

    return (
        <div className="employee-management">
            <div className="card">
                <div className="flex justify-content-between align-items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-900 m-0 mb-2">Employees</h1>
                        <p className="text-600 mt-0 mb-0">
                            Manage your team members and their information
                        </p>
                    </div>
                    <div>
                        {permissions.canCreateEmployees() && (
                            <Button
                                label="Add Employee"
                                icon="pi pi-plus"
                                className="p-button-success"
                                onClick={handleAddEmployee}
                            />
                        )}
                    </div>
                </div>
                
                <EmployeeList user={user} triggerCreate={triggerCreate} />
            </div>
        </div>
    );
};

export default EmployeeManagement;
