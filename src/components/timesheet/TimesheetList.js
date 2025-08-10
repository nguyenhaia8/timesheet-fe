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
import { 
  getWeekForDate, 
  formatWeekRange, 
  getTimesheetPeriodSuggestions
} from '../../utils/dateUtils';
import TimesheetEntryList from './TimesheetEntryList';
import TimesheetDetail from './TimesheetDetail';
import TimesheetWeeklyView from './TimesheetWeeklyView';
import './TimesheetList.css';

const TimesheetList = ({ user }) => {
    const [timesheets, setTimesheets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [filters, setFilters] = useState({
        status: { value: null, matchMode: FilterMatchMode.EQUALS },
        periodStartDate: { value: null, matchMode: FilterMatchMode.DATE_IS },
        periodEndDate: { value: null, matchMode: FilterMatchMode.DATE_IS }
    });

    // Dialog states
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [createDialogTimesheetId, setCreateDialogTimesheetId] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showWeeklyDialog, setShowWeeklyDialog] = useState(false);
    const [selectedTimesheet, setSelectedTimesheet] = useState(null);

    // Date range picker state for filtering timesheets
    const getDefaultFromDate = () => {
        const currentDate = new Date();
        // Set to start of day to avoid time issues
        currentDate.setHours(0, 0, 0, 0);
        const oneMonthBefore = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
        oneMonthBefore.setHours(0, 0, 0, 0);
        return oneMonthBefore;
    };
    
    const getCurrentDate = () => {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        return currentDate;
    };
    
    const [fromDate, setFromDate] = useState(getDefaultFromDate());
    const [toDate, setToDate] = useState(getCurrentDate());
    const [isDateRangeActive, setIsDateRangeActive] = useState(true); // Default to active since we have default dates

    const toast = useRef(null);

    // Status options
    const statusOptions = [
        { label: 'Draft', value: 'Draft' },
        { label: 'Submitted', value: 'Submitted' },
        { label: 'Approved', value: 'Approved' },
        { label: 'Rejected', value: 'Rejected' }
    ];

    // Load initial data with default date range
    useEffect(() => {
        if (fromDate && toDate) {
            loadTimesheets(fromDate, toDate);
        } else {
            loadTimesheets();
        }
    }, [first, rows, filters]);

    const loadTimesheets = async (startDate = null, endDate = null) => {
        try {
            setLoading(true);
            let response;

            // With the real API, all users only see their own timesheets
            // The API automatically filters by the authenticated user's employee ID
            if (startDate && endDate) {
                response = await timesheetService.getCurrentUserTimesheets(startDate, endDate);
            } else {
                response = await timesheetService.getCurrentUserTimesheets();
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

    const handleCreate = () => {
        // Get employeeId from session/localStorage
        const userData = localStorage.getItem('userData');
        const employeeId = userData ? JSON.parse(userData).employee?.id : null;
        // Calculate current week (Monday to today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dayOfWeek = today.getDay();
        const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - offset);
        startOfWeek.setHours(0, 0, 0, 0);
        const periodStart = startOfWeek.toISOString().slice(0, 10);
        const periodEnd = today.toISOString().slice(0, 10);

        // Fetch timesheet for employee and week
        const fetchTimesheet = async () => {
            try {
                const timesheets = await timesheetService.getEmployeeTimesheets(employeeId, null, periodStart, periodEnd);
                // Use the first timesheet for the week, or null if none
                const timesheet = Array.isArray(timesheets) && timesheets.length > 0 ? timesheets[0] : null;
                setCreateDialogTimesheetId(timesheet ? timesheet.timesheetId : null);
                setSelectedTimesheet(null);
                setShowCreateDialog(true);
            } catch (error) {
                setCreateDialogTimesheetId(null);
                setSelectedTimesheet(null);
                setShowCreateDialog(true);
            }
        };
        fetchTimesheet();
    };

    const handleEdit = (timesheet) => {
        const statusMap = {
            'DRAFT': 'Draft',
            'SUBMITTED': 'Submitted',
            'APPROVED': 'Approved',
            'REJECTED': 'Rejected',
        };
        const uiStatus = statusMap[timesheet.status] || timesheet.status;
        if (uiStatus !== 'Draft') {
            toast.current.show({
                severity: 'warn',
                summary: 'Cannot Edit',
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
        const statusMap = {
            'DRAFT': 'Draft',
            'SUBMITTED': 'Submitted',
            'APPROVED': 'Approved',
            'REJECTED': 'Rejected',
        };
        const uiStatus = statusMap[timesheet.status] || timesheet.status;
        if (uiStatus !== 'Draft') {
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
                    // Create approval after timesheet submit
                    try {
                        const approval = await (await import('../../services/approvalService')).default.createApproval(timesheet.timesheetId, 'PENDING');
                        toast.current.show({
                            severity: 'success',
                            summary: 'Approval Created',
                            detail: `Approval created for timesheet #${timesheet.timesheetId}`,
                            life: 3000
                        });
                    } catch (err) {
                        toast.current.show({
                            severity: 'error',
                            summary: 'Approval Error',
                            detail: 'Failed to create approval',
                            life: 3000
                        });
                    }
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
        const statusMap = {
            'DRAFT': 'Draft',
            'SUBMITTED': 'Submitted',
            'APPROVED': 'Approved',
            'REJECTED': 'Rejected',
        };
        const uiStatus = statusMap[timesheet.status] || timesheet.status;
        if (uiStatus !== 'Draft') {
            toast.current.show({
                severity: 'warn',
                summary: 'Cannot Delete',
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

    // Handle from date change
    const handleFromDateChange = async (e) => {
        const selectedFromDate = e.value;
        if (selectedFromDate) {
            // Set to start of day to avoid time issues
            selectedFromDate.setHours(0, 0, 0, 0);
        }
        setFromDate(selectedFromDate);
        
        if (selectedFromDate && toDate) {
            // Validate that from date is not after to date
            if (selectedFromDate > toDate) {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Invalid Date Range',
                    detail: 'From date cannot be after To date',
                    life: 3000
                });
                return;
            }
            
            setIsDateRangeActive(true);
            toast.current.show({
                severity: 'info',
                summary: 'Date Range Updated',
                detail: `Filtering from ${selectedFromDate.toLocaleDateString()} to ${toDate.toLocaleDateString()}`,
                life: 3000
            });

            try {
                await loadTimesheets(selectedFromDate, toDate);
            } catch (error) {
                console.error('Error loading timesheets for selected date range:', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load timesheets for selected date range',
                    life: 3000
                });
            }
        } else if (!selectedFromDate) {
            setIsDateRangeActive(false);
            await loadTimesheets();
        }
    };

    // Handle to date change
    const handleToDateChange = async (e) => {
        const selectedToDate = e.value;
        if (selectedToDate) {
            // Set to start of day to avoid time issues
            selectedToDate.setHours(0, 0, 0, 0);
        }
        setToDate(selectedToDate);
        
        if (fromDate && selectedToDate) {
            // Validate that to date is not before from date
            if (selectedToDate < fromDate) {
                toast.current.show({
                    severity: 'warn',
                    summary: 'Invalid Date Range',
                    detail: 'To date cannot be before From date',
                    life: 3000
                });
                return;
            }
            
            setIsDateRangeActive(true);
            toast.current.show({
                severity: 'info',
                summary: 'Date Range Updated',
                detail: `Filtering from ${fromDate.toLocaleDateString()} to ${selectedToDate.toLocaleDateString()}`,
                life: 3000
            });

            try {
                await loadTimesheets(fromDate, selectedToDate);
            } catch (error) {
                console.error('Error loading timesheets for selected date range:', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load timesheets for selected date range',
                    life: 3000
                });
            }
        } else if (!selectedToDate) {
            setIsDateRangeActive(false);
            await loadTimesheets();
        }
    };

    const clearDateRangeSelection = async () => {
        setFromDate(null);
        setToDate(null);
        setIsDateRangeActive(false);
        
        // Reload all timesheets
        await loadTimesheets();
        toast.current.show({
            severity: 'info',
            summary: 'Filter Cleared',
            detail: 'Showing all timesheets',
            life: 3000
        });
    };

    const resetToDefaultDateRange = async () => {
        const defaultFromDate = getDefaultFromDate();
        const defaultToDate = getCurrentDate();
        
        setFromDate(defaultFromDate);
        setToDate(defaultToDate);
        setIsDateRangeActive(true);
        
        await loadTimesheets(defaultFromDate, defaultToDate);
        toast.current.show({
            severity: 'info',
            summary: 'Reset to Default',
            detail: `Showing last month: ${defaultFromDate.toLocaleDateString()} to ${defaultToDate.toLocaleDateString()}`,
            life: 3000
        });
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
        const weekInfo = getWeekForDate(rowData.periodStartDate);
        const weekRange = formatWeekRange(rowData.periodStartDate, rowData.periodEndDate);
        
        return (
            <div className="timesheet-period">
                <div className="period-dates font-medium">
                    {weekRange}
                </div>
                <div className="period-week text-sm text-500">
                    Week {weekInfo.weekNumber} of {weekInfo.monthYear}
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
        // Map backend status to UI status
        const statusMap = {
            'DRAFT': 'Draft',
            'SUBMITTED': 'Submitted',
            'APPROVED': 'Approved',
            'REJECTED': 'Rejected',
        };
        const uiStatus = statusMap[rowData.status] || rowData.status;
        return (
            <Tag 
                value={uiStatus} 
                severity={getSeverity(uiStatus)}
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
        // Map backend status to UI status
        const statusMap = {
            'DRAFT': 'Draft',
            'SUBMITTED': 'Submitted',
            'APPROVED': 'Approved',
            'REJECTED': 'Rejected',
        };
        const uiStatus = statusMap[rowData.status] || rowData.status;
        const isDraft = uiStatus === 'Draft';
        const canEdit = isDraft;
        const canSubmit = isDraft;
        const canDelete = isDraft;


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
                {/* Approve button removed as requested */}
            </div>
        );
    };

    // Toolbar
    const leftToolbarTemplate = () => {
        return null; // Empty left side
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex align-items-center">
                <Button
                    label="New Timesheet"
                    icon="pi pi-plus"
                    className="p-button-success"
                    onClick={handleCreate}
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
                    className="mb-3" 
                    start={leftToolbarTemplate} 
                    end={rightToolbarTemplate}
                />

                {/* Date Range Picker Section - Left Aligned */}
                <div className="mb-4">
                    <div className="flex align-items-center gap-3 flex-wrap">
                        <label className="text-sm text-600 font-medium">
                            Filter by Date Range:
                        </label>
                        
                        <div className="flex align-items-center gap-2">
                            <label htmlFor="fromDatePicker" className="text-sm text-500">
                                From:
                            </label>
                            <Calendar
                                id="fromDatePicker"
                                value={fromDate}
                                onChange={handleFromDateChange}
                                placeholder="Select from date"
                                showIcon
                                dateFormat="yy-mm-dd"
                                className="w-10rem"
                                tooltip="Select start date for filtering"
                                maxDate={toDate || getCurrentDate()} // Cannot select after 'to' date or future
                                showClear
                            />
                        </div>
                        
                        <div className="flex align-items-center gap-2">
                            <label htmlFor="toDatePicker" className="text-sm text-500">
                                To:
                            </label>
                            <Calendar
                                id="toDatePicker"
                                value={toDate}
                                onChange={handleToDateChange}
                                placeholder="Select to date"
                                showIcon
                                dateFormat="yy-mm-dd"
                                className="w-10rem"
                                tooltip="Select end date for filtering"
                                minDate={fromDate} // Cannot select before 'from' date
                                maxDate={getCurrentDate()} // Cannot select future dates
                                showClear
                            />
                        </div>
                        
                        <div className="flex gap-1">
                            <Button
                                icon="pi pi-times"
                                className="p-button-rounded p-button-text p-button-sm"
                                onClick={clearDateRangeSelection}
                                tooltip="Clear date filter"
                                disabled={!isDateRangeActive}
                            />
                            <Button
                                icon="pi pi-refresh"
                                className="p-button-rounded p-button-text p-button-sm"
                                onClick={resetToDefaultDateRange}
                                tooltip="Reset to last month"
                            />
                        </div>
                        
                        {/* Range Info Display */}
                        {isDateRangeActive && fromDate && toDate && (
                            <div className="text-sm text-600 border-left-2 border-primary pl-2">
                                {fromDate.toLocaleDateString()} - {toDate.toLocaleDateString()}
                            </div>
                        )}
                    </div>
                </div>

                {/* Date Range Filter Info Panel */}
                {isDateRangeActive && fromDate && toDate && (
                    <div className="mb-3 p-2 border-round surface-100 border-left-3 border-primary">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-filter text-primary"></i>
                            <span className="text-sm">
                                <strong>Filtered by Date Range:</strong> 
                                {fromDate.toLocaleDateString()} to {toDate.toLocaleDateString()}
                            </span>
                            <span className="text-xs text-500">
                                ({Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1} days)
                            </span>
                        </div>
                    </div>
                )}

                <DataTable
                    value={timesheets}
                    lazy={false}
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
                style={{ width: '900px' }}
                header="Add Timesheet Entries"
                modal
                maximizable
                className="p-fluid"
                onHide={() => setShowCreateDialog(false)}
            >
                <TimesheetEntryList
                    timesheetId={createDialogTimesheetId}
                />
            </Dialog>

            {/* Edit Timesheet Dialog */}
            <Dialog
                visible={showEditDialog}
                style={{ width: '900px' }}
                header="Edit Timesheet & Entries"
                modal
                maximizable
                className="p-fluid"
                onHide={() => setShowEditDialog(false)}
            >
                {selectedTimesheet && (
                    <TimesheetEntryList
                        timesheetId={selectedTimesheet.timesheetId}
                        editable
                        onSave={async (updatedEntries) => {
                            // Call backend to update timesheet and entries
                            try {
                                await timesheetService.updateTimesheetWithEntries(selectedTimesheet.timesheetId, updatedEntries);
                                toast.current.show({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Timesheet and entries updated successfully',
                                    life: 3000
                                });
                                setShowEditDialog(false);
                                loadTimesheets();
                            } catch (error) {
                                toast.current.show({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Failed to update timesheet and entries',
                                    life: 3000
                                });
                            }
                        }}
                        onCancel={() => setShowEditDialog(false)}
                    />
                )}
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
                />
            </Dialog>
        </div>
    );
};

export default TimesheetList;
