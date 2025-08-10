import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { timesheetService } from '../../services/timesheetService';
import './TimesheetWeeklyView.css';

const TimesheetWeeklyView = ({ timesheet, user, onSave, onClose, permissions }) => {
    const [entries, setEntries] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showEntryDialog, setShowEntryDialog] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [weekDays, setWeekDays] = useState([]);
    const [totalHours, setTotalHours] = useState(0);
    
    // Form state for new/edit entry
    const [entryForm, setEntryForm] = useState({
        date: '',
        projectId: null,
        taskDescription: '',
        hoursWorked: 0
    });

    const toast = useRef(null);

    useEffect(() => {
        if (timesheet) {
            loadTimesheetData();
            generateWeekDays();
        }
    }, [timesheet]);

    useEffect(() => {
        calculateTotalHours();
    }, [entries]);

    const loadTimesheetData = async () => {
        try {
            setLoading(true);
            
            // Load timesheet entries using getTimesheetById
            const timesheetObj = await timesheetService.getTimesheetById(timesheet.timesheetId);
            setEntries(timesheetObj?.timeSheetEntries || []);
            
            // Use local projects filtered by timesheet entries
            const allProjects = require('../../mock/data/projects').default;
            const usedProjectIds = new Set((timesheetObj?.timeSheetEntries || []).map(e => e.projectId));
            setProjects(allProjects.filter(p => usedProjectIds.has(p.projectId)));
        } catch (error) {
            console.error('Error loading timesheet data:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load timesheet data',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const generateWeekDays = () => {
        const start = new Date(timesheet.periodStartDate);
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            days.push({
                date: date.toISOString().split('T')[0],
                displayDate: date.toLocaleDateString(),
                dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
                dayShort: date.toLocaleDateString('en-US', { weekday: 'short' }),
                isWeekend: date.getDay() === 0 || date.getDay() === 6
            });
        }
        setWeekDays(days);
    };

    const calculateTotalHours = () => {
        const total = entries.reduce((sum, entry) => sum + (entry.hoursWorked || 0), 0);
        setTotalHours(total);
    };

    const getHoursForDay = (date) => {
        const dayEntries = entries.filter(entry => entry.date === date);
        return dayEntries.reduce((total, entry) => total + (entry.hoursWorked || 0), 0);
    };

    const handleAddEntry = (date = '') => {
        if (timesheet.status !== 'Draft') {
            toast.current.show({
                severity: 'warn',
                summary: 'Cannot Modify',
                detail: 'Only draft timesheets can be modified',
                life: 3000
            });
            return;
        }

        setSelectedEntry(null);
        setEntryForm({
            date: date,
            projectId: null,
            taskDescription: '',
            hoursWorked: 0
        });
        setShowEntryDialog(true);
    };

    const handleEditEntry = (entry) => {
        if (timesheet.status !== 'Draft') {
            toast.current.show({
                severity: 'warn',
                summary: 'Cannot Modify',
                detail: 'Only draft timesheets can be modified',
                life: 3000
            });
            return;
        }

        setSelectedEntry(entry);
        setEntryForm({
            date: entry.date,
            projectId: entry.projectId,
            taskDescription: entry.taskDescription,
            hoursWorked: entry.hoursWorked
        });
        setShowEntryDialog(true);
    };

    const handleDeleteEntry = (entry) => {
        if (timesheet.status !== 'Draft') {
            toast.current.show({
                severity: 'warn',
                summary: 'Cannot Modify',
                detail: 'Only draft timesheets can be modified',
                life: 3000
            });
            return;
        }

        confirmDialog({
            message: `Are you sure you want to delete this time entry?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await timesheetService.deleteTimesheetEntry(entry.entryId);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Time entry deleted successfully',
                        life: 3000
                    });
                    loadTimesheetData();
                    onSave && onSave();
                } catch (error) {
                    console.error('Error deleting entry:', error);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete time entry',
                        life: 3000
                    });
                }
            }
        });
    };

    const handleSaveEntry = async () => {
        // Validation
        if (!entryForm.date) {
            toast.current.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Date is required',
                life: 3000
            });
            return;
        }

        if (!entryForm.projectId) {
            toast.current.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Project is required',
                life: 3000
            });
            return;
        }

        if (!entryForm.taskDescription?.trim()) {
            toast.current.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Task description is required',
                life: 3000
            });
            return;
        }

        if (!entryForm.hoursWorked || entryForm.hoursWorked <= 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Hours worked must be greater than 0',
                life: 3000
            });
            return;
        }

        try {
            if (selectedEntry) {
                // Update existing entry
                await timesheetService.updateTimesheetEntry(selectedEntry.entryId, entryForm);
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Time entry updated successfully',
                    life: 3000
                });
            } else {
                // Create new entry
                await timesheetService.addTimesheetEntry(timesheet.timesheetId, entryForm);
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Time entry added successfully',
                    life: 3000
                });
            }

            setShowEntryDialog(false);
            loadTimesheetData();
            onSave && onSave();
        } catch (error) {
            console.error('Error saving entry:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save time entry',
                life: 3000
            });
        }
    };

    // Column templates
    const dateBodyTemplate = (rowData) => {
        const date = new Date(rowData.date);
        return (
            <div>
                <div className="font-medium">{date.toLocaleDateString()}</div>
                <div className="text-sm text-500">{date.toLocaleDateString('en-US', { weekday: 'long' })}</div>
            </div>
        );
    };

    const projectBodyTemplate = (rowData) => {
        const project = projects.find(p => p.projectId === rowData.projectId);
        return (
            <div>
                <div className="font-medium">Project {rowData.projectId}</div>
                {project && <div className="text-sm text-500">{project.name}</div>}
            </div>
        );
    };

    const hoursBodyTemplate = (rowData) => {
        return (
            <Badge 
                value={`${rowData.hoursWorked}h`} 
                severity="info"
            />
        );
    };

    const actionsBodyTemplate = (rowData) => {
        const isDraft = timesheet.status === 'Draft';
        
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text p-button-sm"
                    onClick={() => handleEditEntry(rowData)}
                    disabled={!isDraft}
                    tooltip="Edit Entry"
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text p-button-sm p-button-danger"
                    onClick={() => handleDeleteEntry(rowData)}
                    disabled={!isDraft}
                    tooltip="Delete Entry"
                />
            </div>
        );
    };

    const cardHeader = (
        <div className="weekly-view-header">
            <div className="flex align-items-center justify-content-between">
                <div>
                    <h3 className="m-0 text-xl font-bold text-900">
                        Weekly Timesheet View
                    </h3>
                    <p className="m-0 text-600 mt-1">
                        {new Date(timesheet.periodStartDate).toLocaleDateString()} - {new Date(timesheet.periodEndDate).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex align-items-center gap-2">
                    <Tag 
                        value={timesheet.status} 
                        severity={timesheet.status === 'Draft' ? 'info' : 
                                 timesheet.status === 'Submitted' ? 'warning' :
                                 timesheet.status === 'Approved' ? 'success' : 'danger'}
                    />
                    <Badge 
                        value={`${totalHours}h`} 
                        severity={totalHours >= 40 ? 'success' : 'warning'}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="timesheet-weekly-view">
            <Toast ref={toast} />
            <ConfirmDialog />

            <Card header={cardHeader}>
                {/* Week Overview */}
                <div className="week-grid mb-4">
                    {weekDays.map((day, index) => {
                        const dayHours = getHoursForDay(day.date);
                        return (
                            <div 
                                key={index} 
                                className={`day-column ${day.isWeekend ? 'weekend' : ''}`}
                            >
                                <div className="day-header">
                                    <div className="day-name font-semibold">{day.dayShort}</div>
                                    <div className="day-date text-sm">{new Date(day.date).getDate()}</div>
                                    <div className="day-hours">
                                        <Badge 
                                            value={`${dayHours}h`} 
                                            severity={dayHours >= 8 ? 'success' : dayHours > 0 ? 'warning' : 'secondary'}
                                        />
                                    </div>
                                </div>
                                {timesheet.status === 'Draft' && (
                                    <Button
                                        icon="pi pi-plus"
                                        className="p-button-sm p-button-outlined w-full mt-2"
                                        onClick={() => handleAddEntry(day.date)}
                                        tooltip="Add Entry"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                <Divider />

                {/* Time Entries Table */}
                <div className="entries-section">
                    <div className="flex justify-content-between align-items-center mb-3">
                        <h4 className="m-0">Time Entries</h4>
                        {timesheet.status === 'Draft' && (
                            <Button
                                label="Add Entry"
                                icon="pi pi-plus"
                                className="p-button-success p-button-sm"
                                onClick={() => handleAddEntry()}
                            />
                        )}
                    </div>

                    <DataTable
                        value={entries}
                        loading={loading}
                        emptyMessage="No time entries found. Click 'Add Entry' to start tracking time."
                        className="p-datatable-sm"
                        responsiveLayout="scroll"
                        sortField="date"
                        sortOrder={1}
                    >
                        <Column
                            field="date"
                            header="Date"
                            body={dateBodyTemplate}
                            sortable
                        />
                        <Column
                            field="projectId"
                            header="Project"
                            body={projectBodyTemplate}
                        />
                        <Column
                            field="taskDescription"
                            header="Task Description"
                            style={{ maxWidth: '300px' }}
                        />
                        <Column
                            field="hoursWorked"
                            header="Hours"
                            body={hoursBodyTemplate}
                            sortable
                        />
                        <Column
                            header="Actions"
                            body={actionsBodyTemplate}
                            exportable={false}
                        />
                    </DataTable>
                </div>

                {/* Summary */}
                <div className="summary-section mt-4 p-3 bg-gray-50 border-round">
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-900">{totalHours}</div>
                                <div className="text-sm text-600">Total Hours</div>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-900">{entries.length}</div>
                                <div className="text-sm text-600">Total Entries</div>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-900">
                                    {totalHours >= 40 ? '✓' : `${40 - totalHours}h left`}
                                </div>
                                <div className="text-sm text-600">Target: 40h</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-content-end gap-2 mt-4">
                    <Button
                        label="Close"
                        icon="pi pi-times"
                        className="p-button-text"
                        onClick={onClose}
                    />
                </div>
            </Card>

            {/* Entry Dialog */}
            <Dialog
                visible={showEntryDialog}
                style={{ width: '500px' }}
                header={selectedEntry ? 'Edit Time Entry' : 'Add Time Entry'}
                modal
                className="p-fluid"
                onHide={() => setShowEntryDialog(false)}
            >
                <div className="field">
                    <label htmlFor="entryDate" className="required">Date</label>
                    <Dropdown
                        id="entryDate"
                        value={entryForm.date}
                        options={weekDays.map(day => ({ 
                            label: `${day.dayName}, ${day.displayDate}`, 
                            value: day.date 
                        }))}
                        onChange={(e) => setEntryForm(prev => ({ ...prev, date: e.value }))}
                        placeholder="Select date"
                    />
                </div>

                <div className="field">
                    <label htmlFor="entryProject" className="required">Project</label>
                    <Dropdown
                        id="entryProject"
                        value={entryForm.projectId}
                        options={projects.map(project => ({ 
                            label: `${project.name || `Project ${project.projectId}`}`, 
                            value: project.projectId 
                        }))}
                        onChange={(e) => setEntryForm(prev => ({ ...prev, projectId: e.value }))}
                        placeholder="Select project"
                    />
                </div>

                <div className="field">
                    <label htmlFor="entryHours" className="required">Hours Worked</label>
                    <InputNumber
                        id="entryHours"
                        value={entryForm.hoursWorked}
                        onValueChange={(e) => setEntryForm(prev => ({ ...prev, hoursWorked: e.value }))}
                        mode="decimal"
                        minFractionDigits={0}
                        maxFractionDigits={2}
                        min={0}
                        max={24}
                        placeholder="0.0"
                    />
                </div>

                <div className="field">
                    <label htmlFor="entryTask" className="required">Task Description</label>
                    <InputTextarea
                        id="entryTask"
                        value={entryForm.taskDescription}
                        onChange={(e) => setEntryForm(prev => ({ ...prev, taskDescription: e.target.value }))}
                        rows={3}
                        placeholder="Describe what you worked on..."
                    />
                </div>

                <div className="flex justify-content-end gap-2 mt-4">
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        className="p-button-text"
                        onClick={() => setShowEntryDialog(false)}
                    />
                    <Button
                        label={selectedEntry ? 'Update' : 'Add'}
                        icon={selectedEntry ? 'pi pi-check' : 'pi pi-plus'}
                        className="p-button-success"
                        onClick={handleSaveEntry}
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default TimesheetWeeklyView;
