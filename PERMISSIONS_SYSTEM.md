# Permissions System Documentation

## Overview

The timesheet application now uses a comprehensive **JSON-based permissions system** that provides fine-grained access control for all features and resources.

## 🏗️ **Permission Structure**

### **Role Object Structure**
```javascript
{
  roleId: 1,
  roleName: 'Employee',
  description: 'Basic employee access',
  permissions: {
    resource: {
      action: [scopes],
      action2: [scopes]
    }
  }
}
```

### **Resources & Actions**
```javascript
permissions: {
  timesheet: {
    view: ['own', 'team', 'all'],
    create: ['own'],
    edit: ['own'],
    submit: ['own'],
    delete: [],
    approve: ['team'],
    reject: ['team']
  },
  project: {
    view: ['assigned', 'all'],
    create: ['all'],
    edit: ['assigned'],
    assign: ['team', 'all']
  },
  employee: {
    view: ['team', 'all'],
    create: ['all'],
    edit: ['all'],
    delete: ['all']
  },
  // ... other resources
}
```

## 📋 **Available Resources**

| Resource | Description |
|----------|-------------|
| `timesheet` | Timesheet management |
| `project` | Project management |
| `employee` | Employee management |
| `department` | Department management |
| `client` | Client management |
| `user` | User account management |
| `role` | Role and permission management |
| `profile` | User profile management |
| `reports` | Report generation and viewing |
| `administration` | System administration |

## 🎯 **Permission Scopes**

| Scope | Description | Example |
|-------|-------------|---------|
| `own` | User's own records | Own timesheets, own profile |
| `team` | User's team members | Team timesheets (for managers) |
| `all` | All records in system | All employees (for admins) |
| `assigned` | Assigned/related records | Assigned projects |
| `hr` | HR-specific scope | HR reports |

## 🔧 **Usage in Components**

### **1. Using the usePermissions Hook**
```javascript
import { usePermissions } from '../hooks/usePermissions';

const MyComponent = ({ user }) => {
  const permissions = usePermissions(user);

  return (
    <div>
      {permissions.canViewTimesheets() && (
        <Button>View Timesheets</Button>
      )}
      
      {permissions.canApproveTimesheets() && (
        <Button>Approve Timesheets</Button>
      )}
      
      {permissions.isAdmin() && (
        <AdminPanel />
      )}
    </div>
  );
};
```

### **2. Checking Specific Permissions**
```javascript
// Check if user can view their own timesheets
permissions.canViewTimesheets('own')

// Check if user can edit team timesheets
permissions.hasPermission('timesheet', 'edit', 'team')

// Check if user has any timesheet permissions
permissions.hasAnyPermission([
  { resource: 'timesheet', action: 'view' },
  { resource: 'timesheet', action: 'create' }
])
```

### **3. Role-Based Checks**
```javascript
// Simple role checks
if (permissions.isAdmin()) {
  // Show admin features
}

if (permissions.isManager()) {
  // Show manager features
}

// Get permission summary
const summary = permissions.getSummary();
console.log(summary);
/*
{
  isAdmin: false,
  isManager: false,
  canViewTimesheets: true,
  canCreateTimesheets: true,
  canApproveTimesheets: false,
  timesheetScope: 'own',
  projectScope: 'assigned'
}
*/
```

## 👥 **Default Role Permissions**

### **🟢 Employee Role**
- ✅ View/create/edit/submit own timesheets
- ✅ View assigned projects
- ✅ Edit own profile
- ❌ No team or admin access

### **🟡 Manager Role**
- ✅ All Employee permissions
- ✅ View team timesheets and employees
- ✅ Approve/reject team timesheets
- ✅ View team reports
- ✅ Assign team to projects
- ❌ No admin access

### **🔴 Admin Role**
- ✅ Full access to all resources
- ✅ System administration
- ✅ User and role management
- ✅ All reports and analytics

### **🔵 HR Role**
- ✅ Employee and department management
- ✅ User account management
- ✅ View all timesheets (read-only)
- ✅ HR-specific reports
- ❌ No timesheet editing/approval

## 🔄 **Permission Checking Flow**

```
1. User logs in → Gets role with permissions
2. Component renders → usePermissions hook processes permissions
3. UI elements → Check permissions before rendering
4. API calls → Validate permissions on backend (future)
```

## 🛠️ **Utility Functions**

### **Core Functions**
```javascript
import { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  isAdmin,
  isManager,
  getPermissionSummary 
} from '../constants/permissions';

// Check single permission
hasPermission(userPermissions, 'timesheet', 'view', 'own')

// Check multiple permissions (OR logic)
hasAnyPermission(userPermissions, [
  { resource: 'timesheet', action: 'view' },
  { resource: 'project', action: 'view' }
])

// Check multiple permissions (AND logic)
hasAllPermissions(userPermissions, [
  { resource: 'timesheet', action: 'view', scope: 'team' },
  { resource: 'timesheet', action: 'approve', scope: 'team' }
])
```

## 🔐 **Security Considerations**

1. **Frontend permissions are for UX only** - Always validate on backend
2. **Permissions are checked reactively** - UI updates when user changes
3. **Role-based navigation** - Sidebar items appear based on permissions
4. **Graceful degradation** - Hidden features vs error messages

## 🧪 **Testing Different Roles**

Update the mock user in `App.js` to test different permission levels:

```javascript
// Test as Manager
const user = {
  // ... employee data
  role: {
    roleId: 2,
    roleName: 'Manager',
    permissions: {
      timesheet: {
        view: ['own', 'team'],
        approve: ['team']
      }
      // ... manager permissions
    }
  }
};
```

## 📊 **Migration Benefits**

✅ **Scalable** - Easy to add new resources and actions  
✅ **Flexible** - Fine-grained control over permissions  
✅ **Maintainable** - Clear separation of concerns  
✅ **Testable** - Easy to test different permission scenarios  
✅ **User-friendly** - Responsive UI based on permissions  

The permissions system provides a robust foundation for secure, role-based access control throughout the timesheet application.

## 🚀 **Next Steps**

1. **Backend Integration** - Validate permissions on API calls
2. **Dynamic Roles** - Allow runtime role assignment
3. **Permission Templates** - Quick role creation
4. **Audit Logging** - Track permission usage
5. **Permission Groups** - Organize related permissions
