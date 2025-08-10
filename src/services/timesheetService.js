// Timesheet Service - using real backend API
import { timesheetApi } from '../api/timesheet';

// Service wrapper functions - these will be the public interface
export const timesheetService = {
  // Timesheet operations
  async getAllTimesheets(filters = {}) {
    try {
      const response = await timesheetApi.getAllTimesheets(filters);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      throw error;
    }
  },

  async getTimesheetById(timesheetId) {
    try {
      const response = await timesheetApi.getTimesheetById(timesheetId);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error fetching timesheet:', error);
      throw error;
    }
  },

  async getEmployeeTimesheets(employeeId, status = null, periodStart = null, periodEnd = null) {
    try {
      const response = await timesheetApi.getEmployeeTimesheets(employeeId, periodStart, periodEnd);
      if (response.success) {
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
      const response = await timesheetApi.createTimesheet(timesheetData);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
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
      const response = await timesheetApi.updateTimesheet(timesheetId, timesheetData);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error updating timesheet:', error);
      throw error;
    }
  },

  async deleteTimesheet(timesheetId) {
    try {
      const response = await timesheetApi.deleteTimesheet(timesheetId);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error deleting timesheet:', error);
      throw error;
    }
  },

  async submitTimesheetForApproval(timesheetId) {
    try {
      const response = await timesheetApi.submitTimesheetForApproval(timesheetId);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error submitting timesheet:', error);
      throw error;
    }
  },

  // Timesheet entry operations
  async getTimesheetEntries(timesheetId) {
    try {
      const response = await timesheetApi.getTimesheetEntries(timesheetId);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error fetching timesheet entries:', error);
      throw error;
    }
  },

  async addTimesheetEntry(timesheetId, entryData) {
    try {
      const response = await timesheetApi.addTimesheetEntry(timesheetId, entryData);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error adding timesheet entry:', error);
      throw error;
    }
  },

  async updateTimesheetEntry(entryId, entryData) {
    try {
      const response = await timesheetApi.updateTimesheetEntry(entryId, entryData);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error updating timesheet entry:', error);
      throw error;
    }
  },

  async deleteTimesheetEntry(entryId) {
    try {
      const response = await timesheetApi.deleteTimesheetEntry(entryId);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error deleting timesheet entry:', error);
      throw error;
    }
  },

  // Project operations
  async getEmployeeProjects(employeeId) {
    try {
      const response = await timesheetApi.getEmployeeProjects(employeeId);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error fetching employee projects:', error);
      throw error;
    }
  }
};

export default timesheetService;
