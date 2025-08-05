# Mock Database Directory

## 📁 Structure Overview

```
src/mock/
├── 📁 data/           # Static mock data files
│   ├── employees.js   # Employee mock data
│   ├── departments.js # Department mock data
│   ├── projects.js    # Project mock data
│   ├── timesheets.js  # Timesheet mock data
│   ├── clients.js     # Client mock data
│   └── index.js       # Export all mock data
│
├── 📁 api/           # Mock API service layer
│   ├── mockApi.js    # Base mock API with CRUD operations
│   ├── employeeApi.js # Employee API endpoints
│   ├── timesheetApi.js # Timesheet API endpoints
│   └── index.js      # Export all API functions
│
└── 📄 README.md      # This documentation
```

## 🎯 Purpose

This directory serves as a **temporary backend replacement** that:
- Provides realistic test data for development
- Simulates API responses and delays
- Allows frontend development without backend dependency
- Easy to replace with real API calls later

## 🔧 Implementation Strategy

### 1. **Data Layer** (`/data`)
- Static JavaScript objects representing database records
- Relationships between entities (foreign keys)
- Realistic sample data for testing

### 2. **API Layer** (`/api`)
- Mock functions that simulate HTTP requests
- Promise-based responses with artificial delays
- CRUD operations (Create, Read, Update, Delete)
- Error simulation for testing error handling

## 🚀 Benefits

✅ **Rapid Development** - Start building UI immediately  
✅ **Realistic Testing** - Test with meaningful data  
✅ **Error Scenarios** - Simulate network failures  
✅ **Easy Migration** - Simple to replace with real APIs  
✅ **Offline Development** - No backend dependency  

## 🔄 Migration Path

When backend is ready:
1. Keep the same function signatures in services
2. Replace mock API calls with real HTTP requests
3. Update import statements from mock to real services
4. Remove mock directory

## 📝 Usage Example

```javascript
// In a component
import { getTimesheets, createTimesheet } from '../mock/api';

// Use exactly like real API
const timesheets = await getTimesheets(employeeId);
const newTimesheet = await createTimesheet(timesheetData);
```

This approach ensures **zero code changes** when switching to real backend APIs.
