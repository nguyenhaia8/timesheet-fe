// Export all mock API functions
export * from './mockApi';
export * from './timesheetApi';
export * from './employeeApi';

// For easier imports, you can also create specific exports
import * as timesheetApi from './timesheetApi';
import * as employeeApi from './employeeApi';

export { timesheetApi, employeeApi };

// Example usage documentation:
/*
// Import specific functions
import { getTimesheets, createTimesheet } from '../mock/api';

// Or import all from a specific API
import { timesheetApi } from '../mock/api';
const timesheets = await timesheetApi.getTimesheets();

// Individual function imports
import { 
  getEmployees, 
  authenticateEmployee,
  getTimesheetsByEmployee 
} from '../mock/api';
*/
