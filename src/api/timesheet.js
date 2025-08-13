// Timesheet API - Real backend integration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://52.228.185.97/api';

// Helper function to get stored token
const getStoredToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getStoredToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to get current user data
const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing stored user data:', error);
    return null;
  }
};

// Helper function to format date as YYYY-MM-DD
const formatDateForAPI = (date) => {
  if (!date) return null;
  if (typeof date === 'string') return date;
  
  // Ensure we're working with a Date object and format as YYYY-MM-DD
  const dateObj = new Date(date);
  return dateObj.toISOString().split('T')[0];
};

export const timesheetApi = {
  // Get employee timesheets for a specific period
  async getEmployeeTimesheets(employeeId, periodStart, periodEnd) {
    try {
      const queryParams = new URLSearchParams();
      if (periodStart) {
        const formattedStart = formatDateForAPI(periodStart);
        if (formattedStart) queryParams.append('periodStart', formattedStart);
      }
      if (periodEnd) {
        const formattedEnd = formatDateForAPI(periodEnd);
        if (formattedEnd) queryParams.append('periodEnd', formattedEnd);
      }
      // Use /employee/{id}/all endpoint for all timesheets
      const url = `${API_BASE_URL}/timesheets/employee/${employeeId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await handleApiResponse(response);
      
      return {
        success: true,
        data,
        message: 'Timesheets retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching employee timesheets:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch timesheets'
      };
    }
  },

  // Get current user's timesheets for a specific period
  async getCurrentUserTimesheets(periodStart, periodEnd) {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser || !currentUser.employee) {
        throw new Error('User not authenticated or employee data not available');
      }

      return await this.getEmployeeTimesheets(currentUser.employee.id, periodStart, periodEnd);
    } catch (error) {
      console.error('Error fetching current user timesheets:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch timesheets'
      };
    }
  },

  // Get current week timesheets for current user
  async getCurrentWeekTimesheets() {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser || !currentUser.employee) {
        throw new Error('User not authenticated or employee data not available');
      }

      // Calculate current week start and end dates
      const now = new Date();
      const startOfWeek = new Date(now);
      const dayOfWeek = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Monday as start of week
      startOfWeek.setDate(diff);
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      const periodStart = startOfWeek.toISOString().split('T')[0];
      const periodEnd = endOfWeek.toISOString().split('T')[0];

      return await this.getEmployeeTimesheets(currentUser.employee.id, periodStart, periodEnd);
    } catch (error) {
      console.error('Error fetching current week timesheets:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch current week timesheets'
      };
    }
  },

  // Get timesheet by ID
  async getTimesheetById(timesheetId) {
    try {
      const response = await fetch(`${API_BASE_URL}/timesheets/${timesheetId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await handleApiResponse(response);
      
      return {
        success: true,
        data,
        message: 'Timesheet retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching timesheet:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch timesheet'
      };
    }
  },

  // Create new timesheet
  async createTimesheet(timesheetData) {
    try {
      const response = await fetch(`${API_BASE_URL}/timesheets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(timesheetData)
      });

      const data = await handleApiResponse(response);
      
      return {
        success: true,
        data,
        message: 'Timesheet created successfully'
      };
    } catch (error) {
      console.error('Error creating timesheet:', error);
      return {
        success: false,
        error: error.message || 'Failed to create timesheet'
      };
    }
  },

  // Create new timesheet with entries
  async createTimesheetWithEntries(timesheetData) {
    try {
      const response = await fetch(`${API_BASE_URL}/timesheets/with-entries`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(timesheetData)
      });

      const data = await handleApiResponse(response);
      
      return {
        success: true,
        data,
        message: 'Timesheet with entries created successfully'
      };
    } catch (error) {
      console.error('Error creating timesheet with entries:', error);
      return {
        success: false,
        error: error.message || 'Failed to create timesheet with entries'
      };
    }
  },

  // Update timesheet
  async updateTimesheet(timesheetId, timesheetData) {
    try {
      const response = await fetch(`${API_BASE_URL}/timesheets/${timesheetId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(timesheetData)
      });

      const data = await handleApiResponse(response);
      
      return {
        success: true,
        data,
        message: 'Timesheet updated successfully'
      };
    } catch (error) {
      console.error('Error updating timesheet:', error);
      return {
        success: false,
        error: error.message || 'Failed to update timesheet'
      };
    }
  },

  // Delete timesheet
  async deleteTimesheet(timesheetId) {
    try {
      const response = await fetch(`${API_BASE_URL}/timesheets/${timesheetId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      await handleApiResponse(response);
      
      return {
        success: true,
        message: 'Timesheet deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting timesheet:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete timesheet'
      };
    }
  },

  // Submit timesheet for approval
  async submitTimesheet(timesheetId) {
    try {
      const response = await fetch(`${API_BASE_URL}/timesheets/${timesheetId}/submit`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await handleApiResponse(response);
      
      return {
        success: true,
        data,
        message: 'Timesheet submitted for approval successfully'
      };
    } catch (error) {
      console.error('Error submitting timesheet:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit timesheet'
      };
    }
  },

  // Get timesheet entries
  async getTimesheetEntries(timesheetId) {
    try {
      const response = await fetch(`${API_BASE_URL}/timesheets/${timesheetId}/entries`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await handleApiResponse(response);
      
      return {
        success: true,
        data,
        message: 'Timesheet entries retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching timesheet entries:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch timesheet entries'
      };
    }
  },

  // Add timesheet entry
  async addTimesheetEntry(timesheetId, entryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/timesheets/${timesheetId}/entries`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(entryData)
      });

      const data = await handleApiResponse(response);
      
      return {
        success: true,
        data,
        message: 'Timesheet entry added successfully'
      };
    } catch (error) {
      console.error('Error adding timesheet entry:', error);
      return {
        success: false,
        error: error.message || 'Failed to add timesheet entry'
      };
    }
  },

  // Update timesheet entry
  async updateTimesheetEntry(entryId, entryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/timesheet-entries/${entryId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(entryData)
      });

      const data = await handleApiResponse(response);
      
      return {
        success: true,
        data,
        message: 'Timesheet entry updated successfully'
      };
    } catch (error) {
      console.error('Error updating timesheet entry:', error);
      return {
        success: false,
        error: error.message || 'Failed to update timesheet entry'
      };
    }
  },

  // Delete timesheet entry
  async deleteTimesheetEntry(entryId) {
    try {
      const response = await fetch(`${API_BASE_URL}/timesheet-entries/${entryId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      await handleApiResponse(response);
      
      return {
        success: true,
        message: 'Timesheet entry deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting timesheet entry:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete timesheet entry'
      };
    }
  },

  // Get employee projects (if needed for timesheet entries)
  async getEmployeeProjects(employeeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${employeeId}/projects`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      const data = await handleApiResponse(response);
      
      return {
        success: true,
        data,
        message: 'Employee projects retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching employee projects:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch employee projects'
      };
    }
  }
};

export default timesheetApi;
