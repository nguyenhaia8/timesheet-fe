-- Comprehensive test data for TimeSheet Management System
-- Run this in MySQL to create test data

USE timesheetdb;

-- Disable safe updates for this session to allow updates filtered by non-key columns
SET SQL_SAFE_UPDATES = 0;

-- Clear existing data (optional - uncomment if you want to start fresh)
-- DELETE FROM UserRole;
-- DELETE FROM User;
-- DELETE FROM EmployeeProject;
-- DELETE FROM TimesheetEntry;
-- DELETE FROM Timesheet;
-- DELETE FROM Approval;
-- DELETE FROM Project;
-- DELETE FROM Employee;
-- DELETE FROM Department;
-- DELETE FROM Client;
-- DELETE FROM Role;

-- Insert Roles
INSERT INTO Role (roleName, description, permissions, createdAt, updatedAt) VALUES 
('ADMIN', 'Administrator with full access', '["ALL"]', NOW(), NOW()),
('MANAGER', 'Manager with team management access', '["MANAGE_TEAM","APPROVE_TIMESHEETS"]', NOW(), NOW()),
('EMPLOYEE', 'Regular employee', '["CREATE_TIMESHEETS","VIEW_OWN_DATA"]', NOW(), NOW()),
('HR', 'Human Resources', '["VIEW_ALL_EMPLOYEES","MANAGE_EMPLOYEES"]', NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Insert Clients
INSERT INTO Client (clientName, contactEmail, contactPhone, address, createdAt, updatedAt) VALUES 
('TechCorp Solutions', 'john@techcorp.com', '+1-555-0101', '123 Tech Street, Silicon Valley, CA', NOW(), NOW()),
('Global Industries', 'sarah@global.com', '+1-555-0102', '456 Business Ave, New York, NY', NOW(), NOW()),
('Innovation Labs', 'mike@innovation.com', '+1-555-0103', '789 Innovation Blvd, Austin, TX', NOW(), NOW()),
('Digital Dynamics', 'lisa@digital.com', '+1-555-0104', '321 Digital Way, Seattle, WA', NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Insert Departments
INSERT INTO Department (name, headEmployeeId, createdAt, updatedAt) VALUES 
('Software Development', NULL, NOW(), NOW()),
('Quality Assurance', NULL, NOW(), NOW()),
('Project Management', NULL, NOW(), NOW()),
('Human Resources', NULL, NOW(), NOW()),
('Design', NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Insert Employees
INSERT INTO Employee (firstName, lastName, email, position, departmentId, managerId, createdAt, updatedAt) VALUES 
('John', 'Doe', 'john.doe@company.com', 'Senior Developer', 1, NULL, NOW(), NOW()),
('Jane', 'Smith', 'jane.smith@company.com', 'QA Engineer', 2, NULL, NOW(), NOW()),
('Bob', 'Johnson', 'bob.johnson@company.com', 'Project Manager', 3, NULL, NOW(), NOW()),
('Alice', 'Brown', 'alice.brown@company.com', 'HR Manager', 4, NULL, NOW(), NOW()),
('Charlie', 'Wilson', 'charlie.wilson@company.com', 'UI/UX Designer', 5, NULL, NOW(), NOW()),
('Diana', 'Davis', 'diana.davis@company.com', 'Developer', 1, 1, NOW(), NOW()),
('Edward', 'Miller', 'edward.miller@company.com', 'Developer', 1, 1, NOW(), NOW()),
('Fiona', 'Garcia', 'fiona.garcia@company.com', 'QA Engineer', 2, 2, NOW(), NOW()),
('George', 'Martinez', 'george.martinez@company.com', 'Developer', 1, 1, NOW(), NOW()),
('Helen', 'Robinson', 'helen.robinson@company.com', 'Designer', 5, 5, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Update Department heads
UPDATE Department SET headEmployeeId = 1 WHERE name = 'Software Development';
UPDATE Department SET headEmployeeId = 2 WHERE name = 'Quality Assurance';
UPDATE Department SET headEmployeeId = 3 WHERE name = 'Project Management';
UPDATE Department SET headEmployeeId = 4 WHERE name = 'Human Resources';
UPDATE Department SET headEmployeeId = 5 WHERE name = 'Design';

-- Insert Projects
INSERT INTO Project (name, description, clientId, projectManagerId, startDate, endDate, status, createdAt, updatedAt) VALUES 
('E-Commerce Platform', 'Modern e-commerce platform with payment integration', 1, 3, '2024-01-15', '2024-06-30', 'ACTIVE', NOW(), NOW()),
('Mobile App Development', 'Cross-platform mobile application', 2, 3, '2024-02-01', '2024-08-15', 'ACTIVE', NOW(), NOW()),
('Website Redesign', 'Complete website redesign and optimization', 3, 3, '2024-03-01', '2024-05-30', 'COMPLETED', NOW(), NOW()),
('CRM System', 'Customer relationship management system', 4, 3, '2024-04-01', '2024-09-30', 'PLANNING', NOW(), NOW()),
('Data Analytics Dashboard', 'Real-time analytics and reporting dashboard', 1, 3, '2024-05-01', '2024-07-31', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Insert Employee-Project assignments
INSERT INTO EmployeeProject (employeeId, projectId, roleInProject, assignedDate, isActive, createdAt, updatedAt) VALUES 
(1, 1, 'Lead Developer', CURDATE(), true, NOW(), NOW()),
(6, 1, 'Developer', CURDATE(), true, NOW(), NOW()),
(7, 1, 'Developer', CURDATE(), true, NOW(), NOW()),
(2, 1, 'QA Lead', CURDATE(), true, NOW(), NOW()),
(8, 1, 'QA Engineer', CURDATE(), true, NOW(), NOW()),
(3, 2, 'Project Manager', CURDATE(), true, NOW(), NOW()),
(9, 2, 'Developer', CURDATE(), true, NOW(), NOW()),
(5, 2, 'UI/UX Lead', CURDATE(), true, NOW(), NOW()),
(10, 2, 'Designer', CURDATE(), true, NOW(), NOW()),
(1, 3, 'Technical Lead', CURDATE(), true, NOW(), NOW()),
(5, 3, 'Design Lead', CURDATE(), true, NOW(), NOW()),
(3, 4, 'Project Manager', CURDATE(), true, NOW(), NOW()),
(1, 5, 'Lead Developer', CURDATE(), true, NOW(), NOW()),
(6, 5, 'Developer', CURDATE(), true, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Insert Users (with BCrypt encoded passwords - all passwords are 'password123')
INSERT INTO User (userName, password, employeeId, isActive, lastLogin, createdAt, updatedAt) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, true, NULL, NOW(), NOW()),
('manager', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 3, true, NULL, NOW(), NOW()),
('employee1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 6, true, NULL, NOW(), NOW()),
('employee2', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 7, true, NULL, NOW(), NOW()),
('qa_lead', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 2, true, NULL, NOW(), NOW()),
('designer', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 5, true, NULL, NOW(), NOW()),
('hr_manager', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 4, true, NULL, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Insert User-Role assignments
INSERT INTO UserRole (userId, roleId, assignedDate, createdAt) VALUES 
((SELECT userId FROM User WHERE userName = 'admin'), (SELECT roleId FROM Role WHERE roleName = 'ADMIN'), CURDATE(), NOW()),
((SELECT userId FROM User WHERE userName = 'manager'), (SELECT roleId FROM Role WHERE roleName = 'MANAGER'), CURDATE(), NOW()),
((SELECT userId FROM User WHERE userName = 'employee1'), (SELECT roleId FROM Role WHERE roleName = 'EMPLOYEE'), CURDATE(), NOW()),
((SELECT userId FROM User WHERE userName = 'employee2'), (SELECT roleId FROM Role WHERE roleName = 'EMPLOYEE'), CURDATE(), NOW()),
((SELECT userId FROM User WHERE userName = 'qa_lead'), (SELECT roleId FROM Role WHERE roleName = 'MANAGER'), CURDATE(), NOW()),
((SELECT userId FROM User WHERE userName = 'designer'), (SELECT roleId FROM Role WHERE roleName = 'EMPLOYEE'), CURDATE(), NOW()),
((SELECT userId FROM User WHERE userName = 'hr_manager'), (SELECT roleId FROM Role WHERE roleName = 'HR'), CURDATE(), NOW())
ON DUPLICATE KEY UPDATE createdAt = NOW();

-- Insert Timesheets
INSERT INTO Timesheet (employeeId, periodStartDate, periodEndDate, totalHours, status, submissionDate, createdAt, updatedAt) VALUES 
(1, '2024-08-05', '2024-08-11', 40.0, 'APPROVED', '2024-08-11 17:00:00', NOW(), NOW()),
(6, '2024-08-05', '2024-08-11', 38.5, 'SUBMITTED', '2024-08-11 17:00:00', NOW(), NOW()),
(7, '2024-08-05', '2024-08-11', 42.0, 'SUBMITTED', '2024-08-11 17:00:00', NOW(), NOW()),
(2, '2024-08-05', '2024-08-11', 40.0, 'APPROVED', '2024-08-11 17:00:00', NOW(), NOW()),
(5, '2024-08-05', '2024-08-11', 35.0, 'DRAFT', NULL, NOW(), NOW()),
(1, '2024-07-29', '2024-08-04', 40.0, 'APPROVED', '2024-08-04 17:00:00', NOW(), NOW()),
(6, '2024-07-29', '2024-08-04', 40.0, 'APPROVED', '2024-08-04 17:00:00', NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Insert Timesheet Entries
INSERT INTO TimesheetEntry (timesheetId, projectId, taskDescription, date, hoursWorked, createdAt, updatedAt) VALUES 
(1, 1, 'Database schema design and implementation', '2024-08-05', 8.0, NOW(), NOW()),
(1, 1, 'API development for user authentication', '2024-08-06', 8.0, NOW(), NOW()),
(1, 1, 'Frontend component development', '2024-08-07', 8.0, NOW(), NOW()),
(1, 5, 'Analytics dashboard development', '2024-08-08', 8.0, NOW(), NOW()),
(1, 1, 'Data visualization implementation', '2024-08-09', 8.0, NOW(), NOW()),
(2, 1, 'Bug fixes and code review', '2024-08-05', 7.5, NOW(), NOW()),
(2, 1, 'Feature development - shopping cart', '2024-08-06', 8.0, NOW(), NOW()),
(2, 1, 'Unit testing and documentation', '2024-08-07', 8.0, NOW(), NOW()),
(2, 1, 'Integration testing', '2024-08-08', 7.5, NOW(), NOW()),
(2, 1, 'Code optimization and refactoring', '2024-08-09', 7.5, NOW(), NOW()),
(3, 1, 'Database optimization', '2024-08-05', 8.0, NOW(), NOW()),
(3, 1, 'Performance testing and tuning', '2024-08-06', 8.0, NOW(), NOW()),
(3, 1, 'Security implementation', '2024-08-07', 8.0, NOW(), NOW()),
(3, 1, 'Deployment preparation', '2024-08-08', 8.0, NOW(), NOW()),
(3, 1, 'Final testing and bug fixes', '2024-08-09', 10.0, NOW(), NOW()),
(4, 1, 'Test case development', '2024-08-05', 8.0, NOW(), NOW()),
(4, 1, 'Automated testing implementation', '2024-08-06', 8.0, NOW(), NOW()),
(4, 1, 'Manual testing and bug reporting', '2024-08-07', 8.0, NOW(), NOW()),
(4, 1, 'Test documentation and reporting', '2024-08-08', 8.0, NOW(), NOW()),
(4, 1, 'Final QA review and sign-off', '2024-08-09', 8.0, NOW(), NOW()),
(5, 2, 'UI/UX design for mobile app', '2024-08-05', 7.0, NOW(), NOW()),
(5, 2, 'Design system creation', '2024-08-06', 7.0, NOW(), NOW()),
(5, 2, 'Prototype development', '2024-08-07', 7.0, NOW(), NOW()),
(5, 2, 'Design review and iterations', '2024-08-08', 7.0, NOW(), NOW()),
(5, 2, 'Final design handoff', '2024-08-09', 7.0, NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Insert Approvals
INSERT INTO Approval (timesheetId, approvedBy, status, comments, approvedAt, createdAt, updatedAt) VALUES 
(1, 3, 'APPROVED', 'All hours look good and well documented', '2024-08-12 09:00:00', NOW(), NOW()),
(2, 3, 'PENDING', 'Waiting for additional documentation', NULL, NOW(), NOW()),
(4, 3, 'APPROVED', 'QA work is properly documented', '2024-08-12 09:00:00', NOW(), NOW()),
(6, 3, 'APPROVED', 'Development work is well documented', '2024-08-05 09:00:00', NOW(), NOW()),
(7, 3, 'APPROVED', 'All hours are reasonable and well documented', '2024-08-05 09:00:00', NOW(), NOW())
ON DUPLICATE KEY UPDATE updatedAt = NOW();

-- Display summary of inserted data
SELECT '=== DATA SUMMARY ===' as info;
SELECT 'Roles' as table_name, COUNT(*) as count FROM Role
UNION ALL
SELECT 'Clients' as table_name, COUNT(*) as count FROM Client
UNION ALL
SELECT 'Departments' as table_name, COUNT(*) as count FROM Department
UNION ALL
SELECT 'Employees' as table_name, COUNT(*) as count FROM Employee
UNION ALL
SELECT 'Projects' as table_name, COUNT(*) as count FROM Project
UNION ALL
SELECT 'EmployeeProjects' as table_name, COUNT(*) as count FROM EmployeeProject
UNION ALL
SELECT 'Users' as table_name, COUNT(*) as count FROM User
UNION ALL
SELECT 'UserRoles' as table_name, COUNT(*) as count FROM UserRole
UNION ALL
SELECT 'Timesheets' as table_name, COUNT(*) as count FROM Timesheet
UNION ALL
SELECT 'TimesheetEntries' as table_name, COUNT(*) as count FROM TimesheetEntry
UNION ALL
SELECT 'Approvals' as table_name, COUNT(*) as count FROM Approval;

-- Display test login credentials
SELECT '=== TEST LOGIN CREDENTIALS ===' as info;
SELECT userName, 'password123' as password, 
       (SELECT GROUP_CONCAT(r.roleName) FROM UserRole ur JOIN Role r ON ur.roleId = r.roleId WHERE ur.userId = u.userId) as roles
FROM User u; 

-- Re-enable safe updates at the end of the script
SET SQL_SAFE_UPDATES = 1;