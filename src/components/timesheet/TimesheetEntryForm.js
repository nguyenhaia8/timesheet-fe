
import React, { useState, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import timesheetService from '../../services/timesheetService';

const TimesheetEntryForm = ({ timesheetId, projects = [], entry, onSuccess }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [date, setDate] = useState(entry ? new Date(entry.date) : today);
    const [projectId, setProjectId] = useState(entry ? entry.projectId : null);
    const [taskDescription, setTaskDescription] = useState(entry ? entry.taskDescription : '');
    const [hoursWorked, setHoursWorked] = useState(entry ? entry.hoursWorked : 0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (entry) {
            setDate(new Date(entry.date));
            setProjectId(entry.projectId);
            setTaskDescription(entry.taskDescription);
            setHoursWorked(entry.hoursWorked);
        } else {
            setDate(today);
        }
    }, [entry]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const entryData = {
                date: date ? date.toISOString().slice(0, 10) : '',
                projectId,
                taskDescription,
                hoursWorked: Number(hoursWorked)
            };
            if (entry && entry.entryId) {
                await timesheetService.updateTimesheetEntry(entry.entryId, entryData);
            } else {
                await timesheetService.addTimesheetEntry(timesheetId, entryData);
            }
            if (onSuccess) onSuccess();
        } catch (error) {
            // handle error
        } finally {
            setLoading(false);
        }
    };

    // Calculate current week range (Monday to today)
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(today.getDate() - offset);
    startOfWeek.setHours(0, 0, 0, 0);
    // Disable dates after today and before start of week
    const disabledDates = (date) => {
        return date < startOfWeek || date > today;
    };

    return (
        <form className="p-fluid" onSubmit={handleSubmit}>
            <div className="field mb-3">
                <label htmlFor="entry-date">Date</label>
                <Calendar 
                    id="entry-date" 
                    value={date} 
                    onChange={e => setDate(e.value)} 
                    dateFormat="yy-mm-dd" 
                    showIcon 
                    required 
                    className="w-full" 
                    minDate={startOfWeek} 
                    maxDate={today} 
                    disabledDates={[]} 
                    disabled={false} 
                    isDateDisabled={disabledDates}
                />
            </div>
            <div className="field mb-3">
                <label htmlFor="entry-project">Project</label>
                <Dropdown id="entry-project" value={projectId} options={projects.map(p => ({ label: p.name, value: p.projectId }))} onChange={e => setProjectId(e.value)} placeholder="Select Project" required className="w-full" />
            </div>
            <div className="field mb-3">
                <label htmlFor="entry-task">Task Description</label>
                <InputText id="entry-task" value={taskDescription} onChange={e => setTaskDescription(e.target.value)} required className="w-full" />
            </div>
            <div className="field mb-3">
                <label htmlFor="entry-hours">Hours Worked</label>
                <InputNumber id="entry-hours" value={hoursWorked} onValueChange={e => setHoursWorked(e.value)} min={0} max={24} required className="w-full" />
            </div>
            <div className="flex justify-content-end gap-2 mt-4">
                <Button type="submit" label={entry ? 'Update Entry' : 'Add Entry'} icon={entry ? 'pi pi-pencil' : 'pi pi-plus'} loading={loading} className="p-button-success" />
            </div>
        </form>
    );
};

export default TimesheetEntryForm;
