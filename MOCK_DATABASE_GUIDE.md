# Mock Database Implementation - Complete Guide

## 🎯 **Overview**

The mock database is implemented in `src/mock/` directory and serves as a **complete backend replacement** during development. This allows frontend development to proceed without waiting for backend APIs.

## 📁 **Directory Structure**

```
src/mock/
├── 📁 data/                    # Mock data files
│   ├── employees.js           # 5 sample employees with roles
│   ├── departments.js         # 5 departments (Engineering, Operations, etc.)
│   ├── clients.js             # 4 clients with contract info
│   ├── projects.js            # 5 projects in various stages
│   ├── timesheets.js          # Sample timesheets + entries
│   ├── users.js               # User accounts + roles + permissions
│   ├── approvals.js           # Approval records + employee-project assignments
│   └── index.js               # Export all data + utility functions
│
├── 📁 api/                    # Mock API layer
│   ├── mockApi.js             # Base CRUD operations + utilities
│   ├── timesheetApi.js        # Timesheet-specific operations
│   ├── employeeApi.js         # Employee + authentication operations
│   └── index.js               # Export all API functions
│
├── index.js                   # Main entry point + configuration
└── README.md                  # Detailed documentation
```

## 🔧 **Key Features**

### ✅ **Realistic Data**
- **50+ records** across all entities
- **Proper relationships** between entities (foreign keys)
- **Realistic dates** and business scenarios
- **Multiple user roles** (Employee, Manager, Admin, HR)

### ✅ **API Simulation**
- **Network delays** (500ms default)
- **Error simulation** (5% random failure rate)
- **Promise-based** responses
- **Proper HTTP status codes**
- **CRUD operations** for all entities

### ✅ **Business Logic**
- **Timesheet workflows** (Draft → Submitted → Approved)
- **Role-based permissions**
- **Project assignments**
- **Manager hierarchies**

## 🚀 **Usage Examples**

### **In Components:**
```javascript
import { timesheetService } from '../services/timesheetService';

// Get employee timesheets
const timesheets = await timesheetService.getEmployeeTimesheets(employeeId);

// Create new timesheet
const newTimesheet = await timesheetService.createTimesheet({
  employeeId: 1,
  periodStartDate: '2025-02-03',
  periodEndDate: '2025-02-09'
});
```

### **In Services:**
```javascript
import { getTimesheets, createTimesheet } from '../mock/api';

// Direct mock API usage
const response = await getTimesheets({ status: 'Draft' });
const timesheets = response.data;
```

## 📊 **Sample Data Summary**

| Entity | Count | Key Features |
|--------|-------|-------------|
| **Employees** | 5 | Different roles, departments, manager relationships |
| **Departments** | 5 | Engineering, Operations, Sales, Marketing, HR |
| **Projects** | 5 | Various stages (Active, Completed, Planning) |
| **Clients** | 4 | Active/inactive contracts |
| **Timesheets** | 5 | Different statuses and time periods |
| **Timesheet Entries** | 10 | Realistic work descriptions and hours |
| **Users** | 5 | Linked to employees with different roles |

## 🔐 **Authentication**

**Test Credentials:**
- **Username:** `john.doe` **Password:** `password123` (Employee)
- **Username:** `mike.johnson` **Password:** `manager123` (Manager)  
- **Username:** `david.brown` **Password:** `admin123` (Admin)

## 🛠 **Configuration**

```javascript
import { setMockDelay, setMockErrorRate } from '../mock';

// Disable delays for testing
setMockDelay(0);

// Reduce error rate
setMockErrorRate(0.01); // 1%
```

## 🔄 **Migration to Real Backend**

**Step 1:** Replace imports in service files
```javascript
// FROM:
import { getTimesheets } from '../mock/api/timesheetApi';

// TO:
import axios from 'axios';
const getTimesheets = (filters) => axios.get('/api/timesheets', { params: filters });
```

**Step 2:** Update service functions to handle HTTP responses
```javascript
// Mock response: { data: [...], status: 200 }
// HTTP response: { data: {...}, status: 200, headers: {...} }
```

**Step 3:** Remove mock directory when no longer needed

## ✅ **Benefits**

- ✅ **Immediate development** start
- ✅ **Realistic testing** scenarios  
- ✅ **Error handling** practice
- ✅ **No backend dependency**
- ✅ **Easy migration** path
- ✅ **Consistent data** across team

## 🎨 **Best Practices**

1. **Always use services** instead of direct mock imports in components
2. **Handle errors** properly for realistic user experience
3. **Test loading states** with network delays
4. **Use TypeScript** for better data modeling (future enhancement)
5. **Keep mock data updated** as features evolve

## 🔍 **Debugging**

```javascript
// Enable detailed logging
import { setMockLogging } from '../mock';
setMockLogging(true);

// Check current data state
import { mockDatabase } from '../mock/data';
console.log('Current employees:', mockDatabase.employees);
```

This mock implementation provides a **production-ready development environment** that closely mimics real backend behavior while maintaining the flexibility needed for rapid frontend development.

## ⚡ **Ready for Development**

The mock database is **fully functional** and ready to support:
- ✅ Login/Authentication flows
- ✅ Timesheet creation and management  
- ✅ Project assignment workflows
- ✅ Approval processes
- ✅ Employee management
- ✅ Role-based access control

**Start building your components** - the data layer is ready! 🚀
