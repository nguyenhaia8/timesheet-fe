import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Tag } from 'primereact/tag';
import { Badge } from 'primereact/badge';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { FilterMatchMode } from 'primereact/api';
import { timesheetService } from '../../services/timesheetService';
import { usePermissions } from '../../hooks/usePermissions';
import TimesheetForm from './TimesheetForm';
import TimesheetDetail from './TimesheetDetail';
import TimesheetWeeklyView from './TimesheetWeeklyView';
import './TimesheetList.css';

const TimesheetList = ({ user }) => {
    const [timesheets, setTimesheets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [globalFilter, setGlobalFilter] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        periodStartDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
        periodEndDate: { value: null, matchMode: FilterMatchMode.DATE_IS }
    });

    // Dialog states
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showWeeklyDialog, setShowWeeklyDialog] = useState(false);
    const [selectedTimesheet, setSelectedTimesheet] = useState(null);

    const toast = useRef(null);
    const permissions = usePermissions(user);

    // Status options
    const statusOptions = [
        { label: 'Draft', value: 'Draft' },
        { label: 'Submitted', value: 'Submitted' },
        { label: 'Approved', value: 'Approved' },
        { label: 'Rejected', value: 'Rejected' }
    ];

    // Load initial data
    useEffect(() => {
        loadTimesheets();
    }, [first, rows, filters]);

    const loadTimesheets = async () => {
        try {
            setLoading(true);
            let response;

            // Load timesheets based on user permissions
            if (permissions.canViewAllTimesheet()) {
                // Admin/HR can see all timesheets
                response = await timesheetService.getAllTimesheets({
                    page: Math.floor(first / rows) + 1,
                    limit: rows,
                    filters: filters,
                    search: globalFilter
                });
            } else {
                // Employees see only their own timesheets
                response = await timesheetService.getEmployeeTimesheets(user.employeeId);
            }

            setTimesheets(response.data || response || []);
            setTotalRecords(response.total || (response.data || response || []).length);
        } catch (error) {
            console.error('Error loading timesheets:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load timesheets',
                life: 3000
            });
        } finally {
            setLoading(false);
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
        if (!permissions.canCreateTimesheets()) {
            toast.current.show({
                severity: 'warn',
                summary: 'Access Denied',
                detail: 'You do not have permission to create timesheets',
                life: 3000
            });
            return;
        }
        setSelectedTimesheet(null);
        setShowCreateDialog(true);
    };

    const handleEdit = (timesheet) => {
        if (!permissions.canEditTimesheet() || timesheet.status !== 'Draft') {
            toast.current.show({
                severity: 'warn',
                summary: 'Access Denied',
                detail: 'You can only edit draft timesheets',
                life: 3000
            });
            return;
        }
        setSelectedTimesheet(timesheet);
        setShowEditDialog(true);
    };

    const handleView = (timesheet) => {
        setSelectedTimesheet(timesheet);
        setShowDetailDialog(true);
    };

    const handleWeeklyView = (timesheet) => {
        setSelectedTimesheet(timesheet);
        setShowWeeklyDialog(true);
    };

    const handleSubmit = async (timesheet) => {
        if (!permissions.canSubmitTimesheet() || timesheet.status !== 'Draft') {
            toast.current.show({
                severity: 'warn',
                summary: 'Access Denied',
                detail: 'You can only submit draft timesheets',
                life: 3000
            });
            return;
        }

        confirmDialog({
            message: `Are you sure you want to submit timesheet for ${formatDateRange(timesheet.periodStartDate, timesheet.periodEndDate)}?`,
            header: 'Confirm Submission',
            icon: 'pi pi-check-circle',
            accept: async () => {
                try {
                    await timesheetService.submitTimesheetForApproval(timesheet.timesheetId);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Timesheet submitted successfully',
                        life: 3000
                    });
                    loadTimesheets();
                } catch (error) {
                    console.error('Error submitting timesheet:', error);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to submit timesheet',
                        life: 3000
                    });
                }
            }
        });
    };

    const handleDelete = (timesheet) => {
        if (!permissions.canDeleteTimesheet() || timesheet.status !== 'Draft') {
            toast.current.show({
                severity: 'warn',
                summary: 'Access Denied',
                detail: 'You can only delete draft timesheets',
                life: 3000
            });
            return;
        }

        confirmDialog({
            message: `Are you sure you want to delete timesheet for ${formatDateRange(timesheet.periodStartDate, timesheet.periodEndDate)}?`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                try {
                    await timesheetService.deleteTimesheet(timesheet.timesheetId);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Timesheet deleted successfully',
                        life: 3000
                    });
                    loadTimesheets();
                } catch (error) {
                    console.error('Error deleting timesheet:', error);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete timesheet',
                        life: 3000
                    });
                }
            }
        });
    };

    const handleSave = async (timesheetData) => {
        try {
            if (selectedTimesheet) {
                await timesheetService.updateTimesheet(selectedTimesheet.timesheetId, timesheetData);
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Timesheet updated successfully',
                    life: 3000
                });
            } else {
                await timesheetService.createTimesheet({
                    ...timesheetData,
                    employeeId: user.employeeId
                });
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Timesheet created successfully',
                    life: 3000
                });
            }
            setShowCreateDialog(false);
            setShowEditDialog(false);
            loadTimesheets();
        } catch (error) {
            console.error('Error saving timesheet:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to save timesheet',
                life: 3000
            });
        }
    };

    // Helper functions
    const formatDateRange = (startDate, endDate) => {
        const start = new Date(startDate).toLocaleDateString();
        const end = new Date(endDate).toLocaleDateString();
        return `${start} - ${end}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    // Column templates
    const periodBodyTemplate = (rowData) => {
        return (
            <div className="timesheet-period">
                <div className="period-dates font-medium">
                    {formatDateRange(rowData.periodStartDate, rowData.periodEndDate)}
                </div>
                <div className="period-week text-sm text-500">
                    Week of {formatDate(rowData.periodStartDate)}
                </div>
            </div>
        );
    };

    const statusBodyTemplate = (rowData) => {
        const getSeverity = (status) => {
            switch (status) {
                case 'Draft': return 'info';
                case 'Submitted': return 'warning';
                case 'Approved': return 'success';
                case 'Rejected': return 'danger';
                default: return 'info';
            }
        };

        return (
            <Tag 
                value={rowData.status} 
                severity={getSeverity(rowData.status)}
            />
        );
    };

    const hoursBodyTemplate = (rowData) => {
        return (
            <div className="text-center">
                <Badge 
                    value={`${rowData.totalHours || 0}h`} 
                    severity={rowData.totalHours >= 40 ? 'success' : 'warning'}
                />
            </div>
        );
    };

    const submissionDateBodyTemplate = (rowData) => {
        if (!rowData.submissionDate) {
            return <span className="text-500">Not submitted</span>;
        }
        return formatDate(rowData.submissionDate);
    };

    const actionBodyTemplate = (rowData) => {
        const isDraft = rowData.status === 'Draft';
        const canEdit = permissions.canEditTimesheet() && isDraft;
        const canSubmit = permissions.canSubmitTimesheet() && isDraft;
        const canDelete = permissions.canDeleteTimesheet() && isDraft;

        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-text p-button-sm"
                    onClick={() => handleView(rowData)}
                    tooltip="View Details"
                />
                <Button
                    icon="pi pi-calendar"
                    className="p-button-rounded p-button-text p-button-sm"
                    onClick={() => handleWeeklyView(rowData)}
                    tooltip="Weekly View"
                />
                {canEdit && (
                    <Button
                        icon="pi pi-pencil"
                        className="p-button-rounded p-button-text p-button-sm"
                        onClick={() => handleEdit(rowData)}
                        tooltip="Edit"
                    />
                )}
                {canSubmit && (
                    <Button
                        icon="pi pi-send"
                        className="p-button-rounded p-button-text p-button-sm p-button-warning"
                        onClick={() => handleSubmit(rowData)}
                        tooltip="Submit"
                    />
                )}
                {canDelete && (
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
            <div className="flex gap-2">
                {permissions.canCreateTimesheets() && (
                    <Button
                        label="New Timesheet"
                        icon="pi pi-plus"
                        className="p-button-success"
                        onClick={handleCreate}
                    />
                )}
                <Button
                    label="Current Week"
                    icon="pi pi-calendar-plus"
                    className="p-button-outlined"
                    onClick={async () => {
                        try {
                            const currentWeek = await timesheetService.getCurrentWeekTimesheet(user.employeeId);
                            if (currentWeek.data) {
                                handleWeeklyView(currentWeek.data);
                            } else {
                                toast.current.show({
                                    severity: 'info',
                                    summary: 'No Timesheet',
                                    detail: 'No timesheet found for current week',
                                    life: 3000
                                });
                            }
                        } catch (error) {
                            console.error('Error loading current week timesheet:', error);
                        }
                    }}
                />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex gap-2">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilter}
                        onChange={onGlobalFilterChange}
                        placeholder="Search timesheets..."
                        className="w-20rem"
                    />
                </span>
                <Button
                    icon="pi pi-refresh"
                    className="p-button-outlined"
                    onClick={loadTimesheets}
                    tooltip="Refresh"
                />
            </div>
        );
    };

    // Filter templates
    const statusFilterTemplate = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={statusOptions}
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
        <div className="timesheet-list">
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="card">
                <Toolbar 
                    className="mb-4" 
                    start={leftToolbarTemplate} 
                    end={rightToolbarTemplate}
                />

                <DataTable
                    value={timesheets}
                    lazy={permissions.canViewAllTimesheet()}
                    dataKey="timesheetId"
                    paginator
                    rows={rows}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    totalRecords={totalRecords}
                    first={first}
                    onPage={onPage}
                    loading={loading}
                    filters={filters}
                    onFilter={onFilter}
                    globalFilterFields={['status', 'periodStartDate', 'periodEndDate']}
                    emptyMessage="No timesheets found"
                    className="p-datatable-timesheets"
                    responsiveLayout="scroll"
                    size="small"
                >
                    <Column
                        field="periodStartDate"
                        header="Period"
                        body={periodBodyTemplate}
                        sortable
                        className="min-w-14rem"
                    />
                    <Column
                        field="status"
                        header="Status"
                        body={statusBodyTemplate}
                        sortable
                        filter
                        filterElement={statusFilterTemplate}
                        className="min-w-8rem"
                    />
                    <Column
                        field="totalHours"
                        header="Hours"
                        body={hoursBodyTemplate}
                        sortable
                        className="min-w-6rem"
                    />
                    <Column
                        field="submissionDate"
                        header="Submitted"
                        body={submissionDateBodyTemplate}
                        sortable
                        filter
                        filterElement={dateFilterTemplate}
                        className="min-w-10rem"
                    />
                    <Column
                        header="Actions"
                        body={actionBodyTemplate}
                        exportable={false}
                        className="min-w-12rem"
                    />
                </DataTable>
            </div>

            {/* Create Timesheet Dialog */}
            <Dialog
                visible={showCreateDialog}
                style={{ width: '500px' }}
                header="Create New Timesheet"
                modal
                className="p-fluid"
                onHide={() => setShowCreateDialog(false)}
            >
                <TimesheetForm
                    timesheet={null}
                    user={user}
                    onSave={handleSave}
                    onCancel={() => setShowCreateDialog(false)}
                />
            </Dialog>

            {/* Edit Timesheet Dialog */}
            <Dialog
                visible={showEditDialog}
                style={{ width: '500px' }}
                header="Edit Timesheet"
                modal
                className="p-fluid"
                onHide={() => setShowEditDialog(false)}
            >
                <TimesheetForm
                    timesheet={selectedTimesheet}
                    user={user}
                    onSave={handleSave}
                    onCancel={() => setShowEditDialog(false)}
                />
            </Dialog>

            {/* Timesheet Detail Dialog */}
            <Dialog
                visible={showDetailDialog}
                style={{ width: '900px' }}
                header="Timesheet Details"
                modal
                onHide={() => setShowDetailDialog(false)}
            >
                <TimesheetDetail
                    timesheet={selectedTimesheet}
                    user={user}
                    onEdit={() => {
                        setShowDetailDialog(false);
                        handleEdit(selectedTimesheet);
                    }}
                    onSubmit={() => {
                        setShowDetailDialog(false);
                        handleSubmit(selectedTimesheet);
                    }}
                    onClose={() => setShowDetailDialog(false)}
                    permissions={permissions}
                />
            </Dialog>

            {/* Weekly View Dialog */}
            <Dialog
                visible={showWeeklyDialog}
                style={{ width: '95vw', height: '90vh' }}
                header="Weekly Timesheet View"
                modal
                maximizable
                onHide={() => setShowWeeklyDialog(false)}
            >
                <TimesheetWeeklyView
                    timesheet={selectedTimesheet}
                    user={user}
                    onSave={loadTimesheets}
                    onClose={() => setShowWeeklyDialog(false)}
                    permissions={permissions}
                />
            </Dialog>
        </div>
    );
};

export default TimesheetList;
