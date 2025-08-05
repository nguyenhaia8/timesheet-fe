# PrimeReact Setup Guide

## Installed Packages:
- **PrimeReact** (v10.9.6) - React UI component library
- **PrimeIcons** (v7.0.0) - Icon library
- **PrimeFlex** (v4.0.0) - CSS utility library

## Setup Steps:

### 1. Import CSS Files in index.js or App.js:
```javascript
// PrimeReact CSS
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
```

### 2. Available Themes:
- lara-light-cyan (default)
- lara-light-blue
- lara-dark-cyan
- lara-dark-blue
- bootstrap4-light-blue
- bootstrap4-dark-blue
- material-design-light
- material-design-dark

### 3. Key Components for Timesheet App:
- **DataTable** - For displaying timesheet lists
- **Calendar** - For date selection
- **InputNumber** - For hours worked
- **Dropdown** - For project/status selection
- **Dialog** - For modals and forms
- **Button** - For actions
- **InputText** - For text inputs
- **Card** - For layout containers
- **Panel** - For collapsible sections
- **Toast** - For notifications
- **Toolbar** - For action bars
- **Menu/Menubar** - For navigation
- **Chart** - For reports and analytics

### 4. PrimeFlex Utilities:
- Grid system with flexbox
- Spacing utilities (p-*, m-*)
- Text utilities
- Display utilities
- Color utilities

### 5. Example Usage:
```javascript
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
```

## Documentation:
- PrimeReact: https://primereact.org/
- PrimeFlex: https://primeflex.org/
- PrimeIcons: https://primereact.org/icons/
