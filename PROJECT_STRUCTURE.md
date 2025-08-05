# Timesheet Application - Project Structure

## 📁 Project Overview

This is a React-based timesheet management application with the following domain models:
- 👤 Employee
- 🏢 Department  
- 🗂️ Project
- ⏱️ Timesheet
- 🧾 TimesheetEntry
- ✅ Approval
- 👤 User
- 🔐 Role
- 🏢 Client
- 🔗 EmployeeProject

## 📂 Directory Structure

```
src/
├── 📁 components/           # React components organized by feature
│   ├── 📁 common/          # Shared/reusable components
│   ├── 📁 employee/        # Employee-related components
│   ├── 📁 department/      # Department management components
│   ├── 📁 project/         # Project management components
│   ├── 📁 timesheet/       # Timesheet components
│   ├── 📁 timesheetEntry/  # TimeSheet entry components
│   ├── 📁 approval/        # Approval workflow components
│   ├── 📁 user/            # User management components
│   ├── 📁 role/            # Role management components
│   └── 📁 client/          # Client management components
│
├── 📁 models/              # Data models and type definitions
├── 📁 services/            # API services and HTTP requests
├── 📁 hooks/               # Custom React hooks
├── 📁 utils/               # Utility functions and helpers
├── 📁 constants/           # Application constants and enums
├── 📁 context/             # React Context providers
├── 📁 pages/               # Top-level page components
├── 📁 styles/              # Global styles and CSS
├── 📄 App.js               # Main application component
└── 📄 index.js             # Application entry point
```

## 🛠️ Technology Stack

- **React** (v19.1.1) - Frontend framework
- **PrimeReact** (v10.9.6) - UI component library
- **PrimeFlex** (v4.0.0) - CSS utility framework
- **PrimeIcons** (v7.0.0) - Icon library

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Setup PrimeReact** (see PRIMEREACT_SETUP.md)

## 📝 Development Guidelines

- Each feature should have its own component directory
- Use meaningful component names in PascalCase
- Keep components small and focused on a single responsibility
- Use custom hooks for reusable stateful logic
- Centralize constants and configuration
- Follow consistent file naming conventions

## 🎯 Next Steps

1. Set up routing (React Router)
2. Create model definitions
3. Set up API services
4. Build common components
5. Implement authentication
6. Create page layouts
7. Build feature-specific components
