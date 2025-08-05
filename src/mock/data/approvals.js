// Mock approval data
export const approvals = [
  {
    approvalId: 1,
    timesheetId: 3,
    approvedBy: 3, // Mike Johnson (Manager)
    approvedAt: '2025-01-20T10:15:00Z',
    status: 'Approved',
    comments: 'Good work on the API integration project. Hours look accurate.',
    createdAt: '2025-01-19T18:00:00Z'
  },
  {
    approvalId: 2,
    timesheetId: 5,
    approvedBy: 3, // Mike Johnson (Manager)
    approvedAt: '2025-01-27T14:30:00Z',
    status: 'Approved',
    comments: 'UI design work completed on schedule.',
    createdAt: '2025-01-26T16:25:00Z'
  },
  {
    approvalId: 3,
    timesheetId: 2,
    approvedBy: null,
    approvedAt: null,
    status: 'Pending',
    comments: null,
    createdAt: '2025-01-26T17:35:00Z'
  }
];

// Mock employee-project assignments
export const employeeProjects = [
  {
    assignmentId: 1,
    employeeId: 1, // John Doe
    projectId: 1,  // E-commerce Platform Redesign
    assignedDate: '2024-01-15',
    role: 'Frontend Developer',
    isActive: true
  },
  {
    assignmentId: 2,
    employeeId: 1, // John Doe
    projectId: 2,  // Mobile App Development
    assignedDate: '2024-03-01',
    role: 'Full Stack Developer',
    isActive: true
  },
  {
    assignmentId: 3,
    employeeId: 1, // John Doe
    projectId: 4,  // API Integration Project
    assignedDate: '2024-02-15',
    role: 'Backend Developer',
    isActive: true
  },
  {
    assignmentId: 4,
    employeeId: 2, // Jane Smith
    projectId: 1,  // E-commerce Platform Redesign
    assignedDate: '2024-01-15',
    role: 'UI/UX Designer',
    isActive: true
  },
  {
    assignmentId: 5,
    employeeId: 2, // Jane Smith
    projectId: 2,  // Mobile App Development
    assignedDate: '2024-03-01',
    role: 'Mobile UI Designer',
    isActive: true
  },
  {
    assignmentId: 6,
    employeeId: 3, // Mike Johnson
    projectId: 3,  // Data Analytics Dashboard
    assignedDate: '2023-10-01',
    role: 'Technical Lead',
    isActive: false // Project completed
  },
  {
    assignmentId: 7,
    employeeId: 3, // Mike Johnson
    projectId: 4,  // API Integration Project
    assignedDate: '2024-02-15',
    role: 'Technical Lead',
    isActive: true
  },
  {
    assignmentId: 8,
    employeeId: 4, // Sarah Williams
    projectId: 1,  // E-commerce Platform Redesign
    assignedDate: '2024-01-15',
    role: 'Project Manager',
    isActive: true
  },
  {
    assignmentId: 9,
    employeeId: 4, // Sarah Williams
    projectId: 2,  // Mobile App Development
    assignedDate: '2024-03-01',
    role: 'Project Manager',
    isActive: true
  },
  {
    assignmentId: 10,
    employeeId: 4, // Sarah Williams
    projectId: 5,  // Legacy System Migration
    assignedDate: '2024-06-01',
    role: 'Project Manager',
    isActive: true
  }
];

export default { approvals, employeeProjects };
