// Mock timesheet data
export const timesheets = [
  {
    timesheetId: 1,
    employeeId: 1,
    periodStartDate: '2025-01-27',
    periodEndDate: '2025-02-02',
    status: 'Draft',
    submissionDate: null,
    totalHours: 0,
    createdAt: '2025-01-27T09:00:00Z',
    updatedAt: '2025-01-27T09:00:00Z'
  },
  {
    timesheetId: 2,
    employeeId: 1,
    periodStartDate: '2025-01-20',
    periodEndDate: '2025-01-26',
    status: 'Submitted',
    submissionDate: '2025-01-26T17:30:00Z',
    totalHours: 40,
    createdAt: '2025-01-20T09:00:00Z',
    updatedAt: '2025-01-26T17:30:00Z'
  },
  {
    timesheetId: 3,
    employeeId: 1,
    periodStartDate: '2025-01-13',
    periodEndDate: '2025-01-19',
    status: 'Approved',
    submissionDate: '2025-01-19T17:45:00Z',
    totalHours: 38.5,
    createdAt: '2025-01-13T09:00:00Z',
    updatedAt: '2025-01-20T10:15:00Z'
  },
  {
    timesheetId: 4,
    employeeId: 2,
    periodStartDate: '2025-01-27',
    periodEndDate: '2025-02-02',
    status: 'Draft',
    submissionDate: null,
    totalHours: 0,
    createdAt: '2025-01-27T09:00:00Z',
    updatedAt: '2025-01-27T09:00:00Z'
  },
  {
    timesheetId: 5,
    employeeId: 2,
    periodStartDate: '2025-01-20',
    periodEndDate: '2025-01-26',
    status: 'Approved',
    submissionDate: '2025-01-26T16:20:00Z',
    totalHours: 40,
    createdAt: '2025-01-20T09:00:00Z',
    updatedAt: '2025-01-27T14:30:00Z'
  }
];

// Mock timesheet entries
export const timesheetEntries = [
  {
    entryId: 1,
    timesheetId: 2,
    date: '2025-01-20',
    projectId: 1,
    taskDescription: 'Frontend development for user dashboard',
    hoursWorked: 8.0,
    createdAt: '2025-01-20T17:00:00Z'
  },
  {
    entryId: 2,
    timesheetId: 2,
    date: '2025-01-21',
    projectId: 1,
    taskDescription: 'Component testing and bug fixes',
    hoursWorked: 7.5,
    createdAt: '2025-01-21T17:00:00Z'
  },
  {
    entryId: 3,
    timesheetId: 2,
    date: '2025-01-22',
    projectId: 2,
    taskDescription: 'API integration for mobile app',
    hoursWorked: 8.0,
    createdAt: '2025-01-22T17:00:00Z'
  },
  {
    entryId: 4,
    timesheetId: 2,
    date: '2025-01-23',
    projectId: 1,
    taskDescription: 'Code review and documentation',
    hoursWorked: 8.0,
    createdAt: '2025-01-23T17:00:00Z'
  },
  {
    entryId: 5,
    timesheetId: 2,
    date: '2025-01-24',
    projectId: 2,
    taskDescription: 'Mobile UI implementation',
    hoursWorked: 8.5,
    createdAt: '2025-01-24T17:00:00Z'
  },
  {
    entryId: 6,
    timesheetId: 3,
    date: '2025-01-13',
    projectId: 1,
    taskDescription: 'Requirements analysis and planning',
    hoursWorked: 8.0,
    createdAt: '2025-01-13T17:00:00Z'
  },
  {
    entryId: 7,
    timesheetId: 3,
    date: '2025-01-14',
    projectId: 1,
    taskDescription: 'Database schema design',
    hoursWorked: 7.5,
    createdAt: '2025-01-14T17:00:00Z'
  },
  {
    entryId: 8,
    timesheetId: 3,
    date: '2025-01-15',
    projectId: 4,
    taskDescription: 'API endpoint development',
    hoursWorked: 8.0,
    createdAt: '2025-01-15T17:00:00Z'
  },
  {
    entryId: 9,
    timesheetId: 3,
    date: '2025-01-16',
    projectId: 4,
    taskDescription: 'Unit testing and integration tests',
    hoursWorked: 7.5,
    createdAt: '2025-01-16T17:00:00Z'
  },
  {
    entryId: 10,
    timesheetId: 3,
    date: '2025-01-17',
    projectId: 1,
    taskDescription: 'Performance optimization',
    hoursWorked: 7.5,
    createdAt: '2025-01-17T17:00:00Z'
  }
];

export default { timesheets, timesheetEntries };
