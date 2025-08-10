import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import timesheetService from '../../services/timesheetService';
import TimesheetEntryForm from './TimesheetEntryForm';

const TimesheetEntryList = ({ timesheetId, projects = [] }) => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);

    useEffect(() => {
        if (timesheetId) {
            loadEntries();
        }
    }, [timesheetId]);

    const loadEntries = async () => {
        setLoading(true);
        try {
            const timesheet = await timesheetService.getTimesheetById(timesheetId);
            setEntries(timesheet?.timeSheetEntries || []);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleAddEntry = () => {
        setSelectedEntry(null);
        setShowAddDialog(true);
    };

    const handleDialogHide = () => {
        setShowAddDialog(false);
    };

    const handleEntryAdded = () => {
        setShowAddDialog(false);
        loadEntries();
    };

    const getProjectName = (projectId) => {
        const project = projects?.find(p => p.projectId === projectId);
        return project ? project.name : projectId;
    };

    const handleEditEntry = (entry) => {
        setSelectedEntry(entry);
        setShowAddDialog(true);
    };

    const handleDeleteEntry = async (entry) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            try {
                await timesheetService.deleteTimesheetEntry(entry.entryId);
                loadEntries();
            } catch (error) {
            }
        }
    };

    const actionBodyTemplate = (rowData) => (
        <div className="flex gap-2">
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-text p-button-sm" onClick={() => handleEditEntry(rowData)} tooltip="Edit" />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-text p-button-sm p-button-danger" onClick={() => handleDeleteEntry(rowData)} tooltip="Delete" />
        </div>
    );

    const handleCancel = () => {
        window.location.reload();
    };

    const handleSaveDraft = async () => {
        try {
            // Get employeeId from localStorage userData
            const userData = localStorage.getItem('userData');
            const employeeId = userData ? JSON.parse(userData).employee?.id : null;
            if (!employeeId) {
                alert('User not authenticated.');
                return;
            }

            // Calculate current week (Monday to Sunday)
            const today = new Date();
            const dayOfWeek = today.getDay();
            const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - offset);
            startOfWeek.setHours(0, 0, 0, 0);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            const payload = {
                employeeId,
                periodStartDate: startOfWeek.toISOString().slice(0, 10),
                periodEndDate: endOfWeek.toISOString().slice(0, 10),
                status: 'DRAFT',
                timeSheetEntries: entries.map(e => ({
                    date: e.date,
                    projectId: e.projectId,
                    taskDescription: e.taskDescription,
                    hoursWorked: e.hoursWorked
                }))
            };

            const result = await timesheetService.createTimesheetWithEntries(payload);
            if (result) {
                alert('Timesheet draft saved successfully!');
            } else {
                alert('Failed to save timesheet draft.');
            }
        } catch (error) {
            alert('Error saving draft: ' + (error.message || error));
        }
    };

    const handleSubmitForApproval = async () => {
        alert('Submit for Approval clicked. Implement submit logic.');
    };

    return (
        <div className="timesheet-entry-list">
            <div className="flex justify-content-end align-items-center mb-3">
                <Button label="Add Entry" icon="pi pi-plus" className="p-button-success" style={{ width: 'auto' }} onClick={handleAddEntry} />
            </div>
            <DataTable value={entries} loading={loading} paginator rows={10} emptyMessage="No entries found">
                <Column field="date" header="Date" sortable body={row => row.date} />
                <Column field="projectId" header="Project" sortable body={row => getProjectName(row.projectId)} />
                <Column field="taskDescription" header="Task Description" sortable />
                <Column field="hoursWorked" header="Hours Worked" sortable />
                <Column header="Actions" body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }} />
            </DataTable>
            <div className="flex justify-content-end gap-2 mt-4">
                <Button label="Cancel" icon="pi pi-times" className="p-button-secondary p-button-sm" style={{ width: 'auto' }} onClick={handleCancel} />
                <Button label="Save Draft" icon="pi pi-save" className="p-button-info p-button-sm" style={{ width: 'auto' }} onClick={handleSaveDraft} />
                <Button label="Submit for Approval" icon="pi pi-send" className="p-button-success p-button-sm" style={{ width: 'auto' }} onClick={handleSubmitForApproval} />
            </div>
            <Dialog header={selectedEntry ? "Edit Timesheet Entry" : "Add Timesheet Entry"} visible={showAddDialog} style={{ width: '30vw' }} onHide={handleDialogHide}>
                <TimesheetEntryForm 
                    timesheetId={timesheetId} 
                    projects={projects} 
                    onSuccess={handleEntryAdded} 
                    entry={selectedEntry}
                />
            </Dialog>
        </div>
    );
};

export default TimesheetEntryList;
