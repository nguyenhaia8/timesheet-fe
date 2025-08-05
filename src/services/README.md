# Services Directory

This directory contains API service files for communicating with the backend.

## Files to be created:

- `api.js` - Base API configuration and common methods
- `employeeService.js` - Employee CRUD operations
- `departmentService.js` - Department CRUD operations
- `projectService.js` - Project CRUD operations
- `timesheetService.js` - Timesheet CRUD operations
- `timesheetEntryService.js` - TimesheetEntry CRUD operations
- `approvalService.js` - Approval workflow operations
- `userService.js` - User management operations
- `roleService.js` - Role management operations
- `clientService.js` - Client management operations
- `authService.js` - Authentication and authorization
- `index.js` - Export all services

## Purpose:
- Handle HTTP requests to backend APIs
- Manage request/response formatting
- Handle error cases and retry logic
- Cache management (if needed)

## Mock Integration:
Currently using mock APIs from `../mock/api` for development.
When backend is ready, simply update the import statements to use real HTTP clients instead of mock functions.

## Migration Strategy:
```javascript
// Current (Mock)
import { getTimesheets } from '../mock/api';

// Future (Real API)
import { getTimesheets } from './timesheetService';
```

The function signatures remain the same, making migration seamless.
