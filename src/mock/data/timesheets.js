// Mock timesheet data
// Current date: August 5, 2025 - Week starts on Sunday August 3, 2025 and ends Saturday August 9, 2025
export const timesheets = [
  // Current week timesheets (August 3-9, 2025)
  {
    timesheetId: 1,
    employeeId: 1,
    periodStartDate: '2025-08-03', // Sunday August 3, 2025
    periodEndDate: '2025-08-09',   // Saturday August 9, 2025
    status: 'Draft',
    submissionDate: null,
    totalHours: 16, // Already has some hours logged
    createdAt: '2025-08-03T09:00:00Z',
    updatedAt: '2025-08-05T14:30:00Z'
  },
  {
    timesheetId: 2,
    employeeId: 2,
    periodStartDate: '2025-08-03', // Sunday August 3, 2025
    periodEndDate: '2025-08-09',   // Saturday August 9, 2025
    status: 'Draft',
    submissionDate: null,
    totalHours: 20,
    createdAt: '2025-08-03T09:00:00Z',
    updatedAt: '2025-08-05T16:45:00Z'
  },
  // Previous week timesheets (July 27 - August 2, 2025)
  {
    timesheetId: 3,
    employeeId: 1,
    periodStartDate: '2025-07-27',
    periodEndDate: '2025-08-02',
    status: 'Submitted',
    submissionDate: '2025-08-02T17:30:00Z',
    totalHours: 40,
    createdAt: '2025-07-27T09:00:00Z',
    updatedAt: '2025-08-02T17:30:00Z'
  },
  {
    timesheetId: 4,
    employeeId: 2,
    periodStartDate: '2025-07-27',
    periodEndDate: '2025-08-02',
    status: 'Approved',
    submissionDate: '2025-08-02T17:45:00Z',
    totalHours: 38.5,
    createdAt: '2025-07-27T09:00:00Z',
    updatedAt: '2025-08-03T10:15:00Z'
  },
  // Week before that (July 20-26, 2025)
  {
    timesheetId: 5,
    employeeId: 1,
    periodStartDate: '2025-07-20',
    periodEndDate: '2025-07-26',
    status: 'Approved',
    submissionDate: '2025-07-26T16:20:00Z',
    totalHours: 40,
    createdAt: '2025-07-20T09:00:00Z',
    updatedAt: '2025-07-27T14:30:00Z'
  },
  {
    timesheetId: 6,
    employeeId: 2,
    periodStartDate: '2025-07-20',
    periodEndDate: '2025-07-26',
    status: 'Approved',
    submissionDate: '2025-07-26T17:00:00Z',
    totalHours: 37.5,
    createdAt: '2025-07-20T09:00:00Z',
    updatedAt: '2025-07-27T11:00:00Z'
  }
];

// Mock timesheet entries
export const timesheetEntries = [
  // Current week entries (August 3-9, 2025) - Employee 1
  {
    entryId: 1,
    timesheetId: 1,
    date: '2025-08-04', // Monday
    projectId: 1,
    taskDescription: 'Frontend development for user dashboard',
    hoursWorked: 8.0,
    createdAt: '2025-08-04T17:00:00Z'
  },
  {
    entryId: 2,
    timesheetId: 1,
    date: '2025-08-05', // Tuesday (today)
    projectId: 1,
    taskDescription: 'Component testing and bug fixes',
    hoursWorked: 8.0,
    createdAt: '2025-08-05T14:30:00Z'
  },
  // Current week entries (August 3-9, 2025) - Employee 2
  {
    entryId: 3,
    timesheetId: 2,
    date: '2025-08-04', // Monday
    projectId: 2,
    taskDescription: 'API integration for mobile app',
    hoursWorked: 8.0,
    createdAt: '2025-08-04T17:00:00Z'
  },
  {
    entryId: 4,
    timesheetId: 2,
    date: '2025-08-05', // Tuesday (today)
    projectId: 2,
    taskDescription: 'Code review and documentation',
    hoursWorked: 8.0,
    createdAt: '2025-08-05T16:45:00Z'
  },
  {
    entryId: 5,
    timesheetId: 2,
    date: '2025-08-05', // Tuesday (today) - additional entry
    projectId: 3,
    taskDescription: 'Client meeting preparation',
    hoursWorked: 4.0,
    createdAt: '2025-08-05T12:30:00Z'
  },
  // Previous week entries (July 27 - August 2, 2025) - Employee 1
  {
    entryId: 6,
    timesheetId: 3,
    date: '2025-07-28', // Monday
    projectId: 1,
    taskDescription: 'Requirements analysis and planning',
    hoursWorked: 8.0,
    createdAt: '2025-07-28T17:00:00Z'
  },
  {
    entryId: 7,
    timesheetId: 3,
    date: '2025-07-29', // Tuesday
    projectId: 1,
    taskDescription: 'Database schema design',
    hoursWorked: 8.0,
    createdAt: '2025-07-29T17:00:00Z'
  },
  {
    entryId: 8,
    timesheetId: 3,
    date: '2025-07-30', // Wednesday
    projectId: 4,
    taskDescription: 'API endpoint development',
    hoursWorked: 8.0,
    createdAt: '2025-07-30T17:00:00Z'
  },
  {
    entryId: 9,
    timesheetId: 3,
    date: '2025-07-31', // Thursday
    projectId: 4,
    taskDescription: 'Unit testing and integration tests',
    hoursWorked: 8.0,
    createdAt: '2025-07-31T17:00:00Z'
  },
  {
    entryId: 10,
    timesheetId: 3,
    date: '2025-08-01', // Friday
    projectId: 1,
    taskDescription: 'Performance optimization',
    hoursWorked: 8.0,
    createdAt: '2025-08-01T17:00:00Z'
  }
];

export default { timesheets, timesheetEntries };
