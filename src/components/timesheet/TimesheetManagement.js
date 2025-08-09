import React from 'react';
import TimesheetList from './TimesheetList';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
import { Message } from 'primereact/message';

const TimesheetManagement = () => {
    const { user } = useAuth();
    const permissions = usePermissions(user);

    // All authenticated users can view their own timesheets
    if (!user) {
        return (
            <div className="card">
                <Message
                    severity="warn"
                    text="Please log in to view your timesheets."
                />
            </div>
        );
    }

    return (
        <div className="timesheet-management">
            <div className="card">
                <div className="flex justify-content-between align-items-center mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-900 m-0">Timesheet Management</h1>
                        <p className="text-600 mt-2 mb-0">
                            Track your time, manage timesheets, and submit for approval
                        </p>
                    </div>
                </div>
                
                <TimesheetList user={user} />
            </div>
        </div>
    );
};

export default TimesheetManagement;
