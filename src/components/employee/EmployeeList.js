import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FilterMatchMode } from 'primereact/api';
import { employeeService } from '../../services/employeeService';
import { usePermissions } from '../../hooks/usePermissions';
import EmployeeForm from './EmployeeForm';
import EmployeeDetail from './EmployeeDetail';
import './EmployeeList.css';

const EmployeeList = ({ user, triggerCreate }) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [globalFilter, setGlobalFilter] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        firstName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        lastName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        email: { value: null, matchMode: FilterMatchMode.CONTAINS },
        position: { value: null, matchMode: FilterMatchMode.CONTAINS },
        departmentId: { value: null, matchMode: FilterMatchMode.EQUALS },
        isActive: { value: null, matchMode: FilterMatchMode.EQUALS }
    });

    // Dialog states
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // Data states
    const [departments, setDepartments] = useState([]);
    const [managers, setManagers] = useState([]);

    const toast = useRef(null);
    const permissions = usePermissions(user);

    // Load initial data
    // Load initial data
    const loadEmployees = useCallback(async () => {
        try {
            setLoading(true);
            const response = await employeeService.getAllEmployees({
                page: Math.floor(first / rows) + 1,
                limit: rows,
                filters: filters,
                search: globalFilter
            });
            setEmployees(response.data || []);
            setTotalRecords(response.total || 0);
        } catch (error) {
            console.error('Error loading employees:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load employees',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    }, [first, rows, filters, globalFilter]);

    useEffect(() => {
        loadEmployees();
        loadDepartments();
        loadManagers();
    }, [loadEmployees]);

    // Handle trigger create from parent
    useEffect(() => {
        if (triggerCreate > 0) {
            handleCreate();
        }
    }, [triggerCreate]);
    const loadDepartments = async () => {
        try {
            // In a real app, this would come from a department service
            const mockDepartments = [
                { label: 'Information Technology', value: 1 },
                { label: 'Human Resources', value: 2 },
                { label: 'Finance', value: 3 },
                { label: 'Marketing', value: 4 },
                { label: 'Operations', value: 5 }
            ];
            setDepartments(mockDepartments);
        } catch (error) {
            console.error('Error loading departments:', error);
        }
    };

    const loadManagers = async () => {
        try {
            const response = await employeeService.getAllEmployees({
                filters: { position: { value: 'Manager', matchMode: FilterMatchMode.CONTAINS } }
            });
            setManagers(response.data || []);
        } catch (error) {
            console.error('Error loading managers:', error);
        }
    };

    const onPage = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const onFilter = (event) => {
        setFilters(event.filters);
        setFirst(0);
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        setGlobalFilter(value);
        setFilters(prev => ({
            ...prev,
            global: { value, matchMode: FilterMatchMode.CONTAINS }
        }));
    };

    const handleCreate = () => {
        if (!permissions.canCreateEmployees()) {
            toast.current.show({
                severity: 'warn',
                summary: 'Access Denied',
                detail: 'You do not have permission to create employees',
                life: 3000
            });
            return;
        }
        setSelectedEmployee(null);
        setShowCreateDialog(true);
    };

    const handleEdit = (employee) => {
        if (!permissions.canEditEmployee()) {
            toast.current.show({
                severity: 'warn',
                summary: 'Access Denied',
                detail: 'You do not have permission to edit employees',
                life: 3000
            });
            return;
        }
        setSelectedEmployee(employee);
        setShowEditDialog(true);
    };

    const handleView = (employee) => {
        setSelectedEmployee(employee);
        setShowDetailDialog(true);
    };

    const handleDelete = (employee) => {
        if (!permissions.canDeleteEmployee()) {
            toast.current.show({
                severity: 'warn',
                summary: 'Access Denied',
                detail: 'You do not have permission to delete employees',
                life: 3000
            });
            return;
        }

        confirmDialog({
            message: `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await employeeService.deleteEmployee(employee.employeeId);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Employee deleted successfully',
                        life: 3000
                    });
                    loadEmployees();
                } catch (error) {
                    console.error('Error deleting employee:', error);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete employee',
                        life: 3000
                    });
                }
            }
        });
    };

    const handleSave = async (employeeData) => {
        try {
            if (selectedEmployee) {
                await employeeService.updateEmployee(selectedEmployee.employeeId, employeeData);
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Employee updated successfully',
                    life: 3000
                });
            } else {
                await employeeService.createEmployee(employeeData);
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Employee created successfully',
                    life: 3000
                });
            }
            setShowCreateDialog(false);
            setShowEditDialog(false);
            loadEmployees();
        } catch (error) {
            console.error('Error saving employee:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save employee',
                life: 3000
            });
        }
    };

    // Column templates
    const nameBodyTemplate = (rowData) => {
        const initials = `${rowData.firstName?.charAt(0) || ''}${rowData.lastName?.charAt(0) || ''}`;
        return (
            <div className="flex align-items-center gap-2">
                <Avatar 
                    label={initials} 
                    size="normal" 
                    shape="circle" 
                    className="mr-2"
                />
                <div>
                    <div className="font-medium">{rowData.firstName} {rowData.lastName}</div>
                    <div className="text-sm text-500">{rowData.email}</div>
                </div>
            </div>
        );
    };

    const departmentBodyTemplate = (rowData) => {
        const department = departments.find(d => d.value === rowData.departmentId);
        return department?.label || 'Unknown Department';
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <Tag 
                value={rowData.isActive ? 'Active' : 'Inactive'} 
                severity={rowData.isActive ? 'success' : 'danger'}
            />
        );
    };

    const hireDateBodyTemplate = (rowData) => {
        return new Date(rowData.hireDate).toLocaleDateString();
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-text p-button-sm"
                    onClick={() => handleView(rowData)}
                    tooltip="View Details"
                />
                {permissions.canEditEmployee() && (
                    <Button
                        icon="pi pi-pencil"
                        className="p-button-rounded p-button-text p-button-sm"
                        onClick={() => handleEdit(rowData)}
                        tooltip="Edit"
                    />
                )}
                {permissions.canDeleteEmployee() && (
                    <Button
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-text p-button-sm p-button-danger"
                        onClick={() => handleDelete(rowData)}
                        tooltip="Delete"
                    />
                )}
            </div>
        );
    };

    // Toolbar
    const leftToolbarTemplate = () => {
        return (
            <div className="flex align-items-center gap-3">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilter}
                        onChange={onGlobalFilterChange}
                        placeholder="Search employees..."
                        className="w-20rem"
                    />
                </span>
                <span className="text-600 ml-2">
                    All Employees ({totalRecords})
                </span>
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-refresh"
                    className="p-button-outlined"
                    onClick={loadEmployees}
                    tooltip="Refresh"
                />
            </div>
        );
    };

    // Filter templates
    const departmentFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={departments}
                onChange={(e) => options.filterCallback(e.value)}
                placeholder="Select Department"
                className="p-column-filter"
                showClear
            />
        );
    };

    const statusFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={[
                    { label: 'Active', value: true },
                    { label: 'Inactive', value: false }
                ]}
                onChange={(e) => options.filterCallback(e.value)}
                placeholder="Select Status"
                className="p-column-filter"
                showClear
            />
        );
    };

    const dateFilterTemplate = (options) => {
        return (
            <Calendar
                value={options.value}
                onChange={(e) => options.filterCallback(e.value)}
                placeholder="Select Date"
                className="p-column-filter"
                showIcon
            />
        );
    };

    return (
        <div className="employee-list">
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="card">
                <Toolbar 
                    className="mb-4" 
                    start={leftToolbarTemplate} 
                    end={rightToolbarTemplate}
                />

                <DataTable
                    value={employees}
                    lazy
                    dataKey="employeeId"
                    paginator
                    rows={rows}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    totalRecords={totalRecords}
                    first={first}
                    onPage={onPage}
                    loading={loading}
                    filters={filters}
                    onFilter={onFilter}
                    globalFilterFields={['firstName', 'lastName', 'email', 'position']}
                    emptyMessage="No employees found"
                    className="p-datatable-employees"
                    responsiveLayout="scroll"
                    size="small"
                >
                    <Column
                        field="firstName"
                        header="Name"
                        body={nameBodyTemplate}
                        sortable
                        filter
                        filterPlaceholder="Search by name"
                        className="min-w-14rem"
                    />
                    <Column
                        field="email"
                        header="Email"
                        sortable
                        filter
                        filterPlaceholder="Search by email"
                        className="min-w-12rem"
                    />
                    <Column
                        field="position"
                        header="Position"
                        sortable
                        filter
                        filterPlaceholder="Search by position"
                        className="min-w-12rem"
                    />
                    <Column
                        field="departmentId"
                        header="Department"
                        body={departmentBodyTemplate}
                        sortable
                        filter
                        filterElement={departmentFilterTemplate}
                        className="min-w-12rem"
                    />
                    <Column
                        header="Actions"
                        body={actionBodyTemplate}
                        exportable={false}
                        className="min-w-10rem"
                    />
                </DataTable>
            </div>

            {/* Create Employee Dialog */}
            <Dialog
                visible={showCreateDialog}
                style={{ width: '600px' }}
                header="Create New Employee"
                modal
                className="p-fluid"
                onHide={() => setShowCreateDialog(false)}
            >
                <EmployeeForm
                    employee={null}
                    departments={departments}
                    managers={managers}
                    onSave={handleSave}
                    onCancel={() => setShowCreateDialog(false)}
                />
            </Dialog>

            {/* Edit Employee Dialog */}
            <Dialog
                visible={showEditDialog}
                style={{ width: '600px' }}
                header="Edit Employee"
                modal
                className="p-fluid"
                onHide={() => setShowEditDialog(false)}
            >
                <EmployeeForm
                    employee={selectedEmployee}
                    departments={departments}
                    managers={managers}
                    onSave={handleSave}
                    onCancel={() => setShowEditDialog(false)}
                />
            </Dialog>

            {/* Employee Detail Dialog */}
            <Dialog
                visible={showDetailDialog}
                style={{ width: '800px' }}
                header="Employee Details"
                modal
                onHide={() => setShowDetailDialog(false)}
            >
                <EmployeeDetail
                    employee={selectedEmployee}
                    departments={departments}
                    onEdit={() => {
                        setShowDetailDialog(false);
                        handleEdit(selectedEmployee);
                    }}
                    onClose={() => setShowDetailDialog(false)}
                    canEdit={permissions.canEditEmployee()}
                />
            </Dialog>
        </div>
    );
};

export default EmployeeList;
