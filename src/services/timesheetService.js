// Timesheet Service - using real backend API
import { timesheetApi } from '../api/timesheet';

// Import mock functions for features not yet implemented in real API
import {
  getTimesheets,
  getTimesheetById,
  createTimesheet,
  updateTimesheet,
  deleteTimesheet,
  submitTimesheet,
  getTimesheetEntries,
  addTimesheetEntry,
  updateTimesheetEntry,
  deleteTimesheetEntry,
  getEmployeeProjects
} from '../mock/api/timesheetApi';

// Service wrapper functions - these will be the public interface
export const timesheetService = {
  // Timesheet operations
  async getAllTimesheets(filters = {}) {
    try {
      const response = await getTimesheets(filters);
      return response.data;
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      throw error;
    }
  },

  async getTimesheetById(timesheetId) {
    try {
      const response = await getTimesheetById(timesheetId);
      return response.data;
    } catch (error) {
      console.error('Error fetching timesheet:', error);
      throw error;
    }
  },

  async getEmployeeTimesheets(employeeId, status = null, periodStart = null, periodEnd = null) {
    try {
      // Use real API for fetching employee timesheets
      const response = await timesheetApi.getEmployeeTimesheets(employeeId, periodStart, periodEnd);
      
      if (response.success) {
        // Filter by status if provided (since backend might not support status filtering yet)
        let timesheets = response.data;
        if (status && Array.isArray(timesheets)) {
          timesheets = timesheets.filter(timesheet => timesheet.status === status);
        }
        return timesheets;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error fetching employee timesheets:', error);
      throw error;
    }
  },

  async getCurrentWeekTimesheet(employeeId) {
    try {
      // Use real API for current week timesheets
      const response = await timesheetApi.getCurrentWeekTimesheets();
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error fetching current week timesheet:', error);
      throw error;
    }
  },

  // New method to get current user's timesheets for any period
  async getCurrentUserTimesheets(periodStart = null, periodEnd = null) {
    try {
      const response = await timesheetApi.getCurrentUserTimesheets(periodStart, periodEnd);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error fetching current user timesheets:', error);
      throw error;
    }
  },

  async createTimesheet(timesheetData) {
    try {
      const response = await createTimesheet(timesheetData);
      return response.data;
    } catch (error) {
      console.error('Error creating timesheet:', error);
      throw error;
    }
  },

  // Create timesheet with entries using real API
  async createTimesheetWithEntries(timesheetData) {
    try {
      const response = await timesheetApi.createTimesheetWithEntries(timesheetData);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error creating timesheet with entries:', error);
      throw error;
    }
  },

  async updateTimesheet(timesheetId, timesheetData) {
    try {
      const response = await updateTimesheet(timesheetId, timesheetData);
      return response.data;
    } catch (error) {
      console.error('Error updating timesheet:', error);
      throw error;
    }
  },

  async deleteTimesheet(timesheetId) {
    try {
      const response = await deleteTimesheet(timesheetId);
      return response.data;
    } catch (error) {
      console.error('Error deleting timesheet:', error);
      throw error;
    }
  },

  async submitTimesheetForApproval(timesheetId) {
    try {
      const response = await submitTimesheet(timesheetId);
      return response.data;
    } catch (error) {
      console.error('Error submitting timesheet:', error);
      throw error;
    }
  },

  // Timesheet entry operations
  async getTimesheetEntries(timesheetId) {
    try {
      const response = await getTimesheetEntries(timesheetId);
      return response.data;
    } catch (error) {
      console.error('Error fetching timesheet entries:', error);
      throw error;
    }
  },

  async addTimesheetEntry(timesheetId, entryData) {
    try {
      const response = await addTimesheetEntry(timesheetId, entryData);
      return response.data;
    } catch (error) {
      console.error('Error adding timesheet entry:', error);
      throw error;
    }
  },

  async updateTimesheetEntry(entryId, entryData) {
    try {
      const response = await updateTimesheetEntry(entryId, entryData);
      return response.data;
    } catch (error) {
      console.error('Error updating timesheet entry:', error);
      throw error;
    }
  },

  async deleteTimesheetEntry(entryId) {
    try {
      const response = await deleteTimesheetEntry(entryId);
      return response.data;
    } catch (error) {
      console.error('Error deleting timesheet entry:', error);
      throw error;
    }
  },

  // Project operations
  async getEmployeeProjects(employeeId) {
    try {
      const response = await getEmployeeProjects(employeeId);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee projects:', error);
      throw error;
    }
  }
};

export default timesheetService;
