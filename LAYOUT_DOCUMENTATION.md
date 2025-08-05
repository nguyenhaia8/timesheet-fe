# Layout Components Documentation

## Overview
The timesheet application now has a complete layout system with a responsive header and sidebar navigation. The layout is built using PrimeReact components and follows modern design principles.

## Components Created

### 🔲 Header Component (`/components/common/Header.js`)
**Features:**
- Fixed top navigation bar
- Logo and application title
- Hamburger menu toggle button
- User avatar and profile information
- Notifications bell with badge
- Logout button
- Responsive design

**Props:**
- `user` - User object with profile information
- `onLogout` - Logout handler function  
- `onToggleSidebar` - Sidebar toggle handler

### 📋 Sidebar Component (`/components/common/Sidebar.js`)
**Features:**
- Collapsible side navigation
- Role-based menu items (employee, manager, admin)
- Nested menu structure with PanelMenu
- Responsive behavior (overlay on mobile)
- Smooth animations

**Menu Structure:**
- **Employee Role:** Dashboard, My Timesheets, Projects, Settings, Profile
- **Manager Role:** + Team Management, Approval Queue
- **Admin Role:** + Administration (Employees, Departments, Projects, Clients, Roles), Reports

**Props:**
- `isVisible` - Controls sidebar visibility
- `userRole` - Determines which menu items to show

### 📐 Layout Component (`/components/common/Layout.js`)
**Features:**
- Main layout wrapper
- Manages sidebar state
- Responsive content area
- Mobile overlay for sidebar
- Coordinate header and sidebar

**Props:**
- `children` - Page content to render
- `user` - User information
- `onLogout` - Logout handler

## 📱 Responsive Design

### Desktop (>1024px)
- Sidebar: 280px wide, always visible
- Content: Full width minus sidebar
- Header: Full width

### Tablet (769px - 1024px)  
- Sidebar: 240px wide, collapsible
- Content: Adjusts based on sidebar state
- Header: Full width

### Mobile (<768px)
- Sidebar: Full width overlay
- Content: Full width
- Header: Full width
- Backdrop overlay when sidebar open

## 🎨 Styling Features

- **CSS Custom Properties** for theming
- **Smooth transitions** for sidebar toggle
- **PrimeFlex utilities** for spacing and layout
- **PrimeReact theme integration**
- **Hover effects** and interactive states
- **Box shadows** for depth

## 🧩 Integration

The layout is integrated into `App.js` and includes:
- PrimeReact CSS imports
- Mock user data
- Dashboard page component
- Logout handler placeholder

## 📄 Dashboard Page
A sample dashboard has been created showing:
- Welcome message
- Statistics cards (hours, projects, approvals)
- Quick action buttons  
- Recent activity feed
- Responsive grid layout

## 🔧 Next Steps

1. **Add React Router** for navigation between pages
2. **Implement authentication** system
3. **Create individual page components**
4. **Add more common components** (modals, forms, tables)
5. **Enhance responsive behavior**
6. **Add theme switching**
7. **Implement notifications system**

## 🚀 Usage Example

```javascript
import { Layout } from './components/common';
import Dashboard from './pages/Dashboard';

function App() {
  const user = { firstName: 'John', role: 'employee' };
  
  return (
    <Layout user={user} onLogout={handleLogout}>
      <Dashboard user={user} />
    </Layout>
  );
}
```

The layout system provides a solid foundation for building the complete timesheet application with professional UI/UX.
