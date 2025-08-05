// Timesheet specific mock API
import { MockApi, MockApiResponse, MockApiError, delay } from './mockApi';
import { timesheets, timesheetEntries } from '../data/timesheets';
import { employeeProjects } from '../data/approvals';

// Import shouldFail from mockApi
const shouldFail = () => Math.random() < 0.05;

class TimesheetMockApi extends MockApi {
  constructor() {
    super(timesheets, 'timesheet');
    this.entries = [...timesheetEntries];
    this.nextEntryId = Math.max(...timesheetEntries.map(e => e.entryId)) + 1;
  }

  // Get timesheets for specific employee
  async getByEmployeeId(employeeId, status = null) {
    await delay(400);
    
    if (shouldFail()) {
      throw new MockApiError('Failed to fetch employee timesheets', 500);
    }

    let employeeTimesheets = this.data.filter(ts => ts.employeeId === employeeId);
    
    if (status) {
      employeeTimesheets = employeeTimesheets.filter(ts => ts.status === status);
    }

    // Sort by period start date (newest first)
    employeeTimesheets.sort((a, b) => new Date(b.periodStartDate) - new Date(a.periodStartDate));

    return new MockApiResponse(employeeTimesheets);
  }

  // Get current week timesheet for employee
  async getCurrentWeekTimesheet(employeeId) {
    await delay(300);
    
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    
    const currentWeekTimesheet = this.data.find(ts => 
      ts.employeeId === employeeId &&
      new Date(ts.periodStartDate) <= endOfWeek &&
      new Date(ts.periodEndDate) >= startOfWeek
    );

    return new MockApiResponse(currentWeekTimesheet || null);
  }

  // Submit timesheet for approval
  async submitTimesheet(timesheetId) {
    await delay(600);
    
    if (shouldFail()) {
      throw new MockApiError('Failed to submit timesheet', 500);
    }

    const index = this.data.findIndex(ts => ts.timesheetId === timesheetId);
    
    if (index === -1) {
      throw new MockApiError('Timesheet not found', 404);
    }

    if (this.data[index].status !== 'Draft') {
      throw new MockApiError('Only draft timesheets can be submitted', 400);
    }

    // Calculate total hours from entries
    const entries = this.entries.filter(e => e.timesheetId === timesheetId);
    const totalHours = entries.reduce((sum, entry) => sum + entry.hoursWorked, 0);

    this.data[index] = {
      ...this.data[index],
      status: 'Submitted',
      submissionDate: new Date().toISOString(),
      totalHours,
      updatedAt: new Date().toISOString()
    };

    return new MockApiResponse(this.data[index], 200, 'Timesheet submitted successfully');
  }

  // Get timesheet entries
  async getTimesheetEntries(timesheetId) {
    await delay(300);
    
    const entries = this.entries.filter(e => e.timesheetId === timesheetId);
    return new MockApiResponse(entries);
  }

  // Add timesheet entry
  async addTimesheetEntry(timesheetId, entryData) {
    await delay(500);
    
    if (shouldFail()) {
      throw new MockApiError('Failed to add timesheet entry', 500);
    }

    // Validate timesheet exists and is in draft status
    const timesheet = this.data.find(ts => ts.timesheetId === timesheetId);
    if (!timesheet) {
      throw new MockApiError('Timesheet not found', 404);
    }
    
    if (timesheet.status !== 'Draft') {
      throw new MockApiError('Cannot modify submitted timesheets', 400);
    }

    const newEntry = {
      ...entryData,
      entryId: this.nextEntryId++,
      timesheetId,
      createdAt: new Date().toISOString()
    };

    this.entries.push(newEntry);
    return new MockApiResponse(newEntry, 201, 'Timesheet entry added successfully');
  }

  // Update timesheet entry
  async updateTimesheetEntry(entryId, entryData) {
    await delay(500);
    
    const index = this.entries.findIndex(e => e.entryId === entryId);
    
    if (index === -1) {
      throw new MockApiError('Timesheet entry not found', 404);
    }

    // Check if parent timesheet is still in draft
    const timesheet = this.data.find(ts => ts.timesheetId === this.entries[index].timesheetId);
    if (timesheet && timesheet.status !== 'Draft') {
      throw new MockApiError('Cannot modify entries in submitted timesheets', 400);
    }

    this.entries[index] = {
      ...this.entries[index],
      ...entryData,
      updatedAt: new Date().toISOString()
    };

    return new MockApiResponse(this.entries[index], 200, 'Timesheet entry updated successfully');
  }

  // Delete timesheet entry
  async deleteTimesheetEntry(entryId) {
    await delay(400);
    
    const index = this.entries.findIndex(e => e.entryId === entryId);
    
    if (index === -1) {
      throw new MockApiError('Timesheet entry not found', 404);
    }

    // Check if parent timesheet is still in draft
    const timesheet = this.data.find(ts => ts.timesheetId === this.entries[index].timesheetId);
    if (timesheet && timesheet.status !== 'Draft') {
      throw new MockApiError('Cannot delete entries from submitted timesheets', 400);
    }

    const deletedEntry = this.entries[index];
    this.entries.splice(index, 1);
    
    return new MockApiResponse(deletedEntry, 200, 'Timesheet entry deleted successfully');
  }

  // Get employee's assigned projects
  async getEmployeeProjects(employeeId) {
    await delay(300);
    
    const assignments = employeeProjects.filter(ep => 
      ep.employeeId === employeeId && ep.isActive
    );
    
    return new MockApiResponse(assignments);
  }
}

// Create singleton instance
const timesheetApi = new TimesheetMockApi();

// Export API functions
export const getTimesheets = (filters) => timesheetApi.getAll(filters);
export const getTimesheetById = (id) => timesheetApi.getById(id);
export const getTimesheetsByEmployee = (employeeId, status) => timesheetApi.getByEmployeeId(employeeId, status);
export const getCurrentWeekTimesheet = (employeeId) => timesheetApi.getCurrentWeekTimesheet(employeeId);
export const createTimesheet = (data) => timesheetApi.create(data);
export const updateTimesheet = (id, data) => timesheetApi.update(id, data);
export const deleteTimesheet = (id) => timesheetApi.delete(id);
export const submitTimesheet = (id) => timesheetApi.submitTimesheet(id);

export const getTimesheetEntries = (timesheetId) => timesheetApi.getTimesheetEntries(timesheetId);
export const addTimesheetEntry = (timesheetId, data) => timesheetApi.addTimesheetEntry(timesheetId, data);
export const updateTimesheetEntry = (entryId, data) => timesheetApi.updateTimesheetEntry(entryId, data);
export const deleteTimesheetEntry = (entryId) => timesheetApi.deleteTimesheetEntry(entryId);

export const getEmployeeProjects = (employeeId) => timesheetApi.getEmployeeProjects(employeeId);

export default timesheetApi;
