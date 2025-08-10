-- Create database aligned with create_test_data.sql
CREATE DATABASE IF NOT EXISTS timesheetdb;
USE timesheetdb;

CREATE TABLE Department (
    departmentId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    headEmployeeId INT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

CREATE TABLE Employee (
    employeeId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    position VARCHAR(255) NOT NULL,
    departmentId INT,
    managerId INT,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (departmentId) REFERENCES Department(departmentId),
    FOREIGN KEY (managerId) REFERENCES Employee(employeeId)
);

-- Add foreign key for Department.headEmployeeId after Employee table is created
ALTER TABLE Department
  ADD CONSTRAINT fk_department_head FOREIGN KEY (headEmployeeId) REFERENCES Employee(employeeId);

CREATE TABLE Client (
    clientId INT AUTO_INCREMENT PRIMARY KEY,
    clientName VARCHAR(255) NOT NULL,
    contactEmail VARCHAR(255),
    contactPhone VARCHAR(50),
    address TEXT,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

CREATE TABLE Project (
    projectId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    startDate DATE NOT NULL,
    endDate DATE,
    clientId INT NOT NULL,
    projectManagerId INT NOT NULL,
    status ENUM('PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'PLANNING',
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    CONSTRAINT fk_project_client FOREIGN KEY (clientId) REFERENCES Client(clientId),
    CONSTRAINT fk_project_manager FOREIGN KEY (projectManagerId) REFERENCES Employee(employeeId)
);

CREATE TABLE EmployeeProject (
    employeeProjectId INT AUTO_INCREMENT PRIMARY KEY,
    employeeId INT NOT NULL,
    projectId INT NOT NULL,
    roleInProject VARCHAR(100),
    assignedDate DATE,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    CONSTRAINT fk_emp_proj_employee FOREIGN KEY (employeeId) REFERENCES Employee(employeeId),
    CONSTRAINT fk_emp_proj_project FOREIGN KEY (projectId) REFERENCES Project(projectId)
);

CREATE TABLE Role (
    roleId INT AUTO_INCREMENT PRIMARY KEY,
    roleName VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSON,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

CREATE TABLE User (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    employeeId INT,
    isActive BOOLEAN DEFAULT true,
    lastLogin DATETIME,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    CONSTRAINT fk_user_employee FOREIGN KEY (employeeId) REFERENCES Employee(employeeId)
);

CREATE TABLE UserRole (
    userRoleId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    roleId INT NOT NULL,
    assignedDate DATE,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_userrole_user FOREIGN KEY (userId) REFERENCES User(userId),
    CONSTRAINT fk_userrole_role FOREIGN KEY (roleId) REFERENCES Role(roleId)
);

CREATE TABLE Timesheet (
    timesheetId INT AUTO_INCREMENT PRIMARY KEY,
    employeeId INT NOT NULL,
    periodStartDate DATE NOT NULL,
    periodEndDate DATE NOT NULL,
    status ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED') DEFAULT 'DRAFT',
    submissionDate DATETIME,
    totalHours DECIMAL(5,2) DEFAULT 0.00,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    CONSTRAINT fk_timesheet_employee FOREIGN KEY (employeeId) REFERENCES Employee(employeeId)
);

CREATE TABLE TimesheetEntry (
    entryId INT AUTO_INCREMENT PRIMARY KEY,
    timesheetId INT NOT NULL,
    date DATE NOT NULL,
    projectId INT NOT NULL,
    taskDescription TEXT NOT NULL,
    hoursWorked DECIMAL(4,2) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    CONSTRAINT fk_entry_timesheet FOREIGN KEY (timesheetId) REFERENCES Timesheet(timesheetId),
    CONSTRAINT fk_entry_project FOREIGN KEY (projectId) REFERENCES Project(projectId)
);

CREATE TABLE Approval (
    approvalId INT AUTO_INCREMENT PRIMARY KEY,
    timesheetId INT NOT NULL,
    approvedBy INT NOT NULL,
    approvedAt DATETIME,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    comments TEXT,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    CONSTRAINT fk_approval_timesheet FOREIGN KEY (timesheetId) REFERENCES Timesheet(timesheetId),
    CONSTRAINT fk_approval_approvedby FOREIGN KEY (approvedBy) REFERENCES Employee(employeeId)
);

-- Create indexes for better performance
CREATE INDEX idx_employee_email ON Employee(email);
CREATE INDEX idx_employee_department ON Employee(departmentId);
CREATE INDEX idx_client_name ON Client(clientName);
CREATE INDEX idx_project_client ON Project(clientId);
CREATE INDEX idx_project_manager ON Project(projectManagerId);
CREATE INDEX idx_timesheet_employee ON Timesheet(employeeId);
CREATE INDEX idx_timesheet_status ON Timesheet(status);
CREATE INDEX idx_timesheet_entry_timesheet ON TimesheetEntry(timesheetId);
CREATE INDEX idx_timesheet_entry_project ON TimesheetEntry(projectId);
CREATE INDEX idx_timesheet_entry_date ON TimesheetEntry(date);
CREATE INDEX idx_approval_timesheet ON Approval(timesheetId);
CREATE INDEX idx_approval_approvedby ON Approval(approvedBy);
CREATE INDEX idx_user_employee ON User(employeeId);