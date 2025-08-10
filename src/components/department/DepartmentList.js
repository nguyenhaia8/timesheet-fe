import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { departmentService } from '../../services/departmentService';
import { employeeService } from '../../services/employeeService';
import { Dropdown } from 'primereact/dropdown';
import './DepartmentList.css';

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [editDepartment, setEditDepartment] = useState(null);
    const [employeeMap, setEmployeeMap] = useState({});
    const [formName, setFormName] = useState('');
    const [formHead, setFormHead] = useState(null);
    const toast = React.useRef(null);

    useEffect(() => {
        loadDepartments();
        loadEmployees();
    }, []);

    const loadDepartments = async () => {
        setLoading(true);
        try {
            const response = await departmentService.getDepartments();
            setDepartments(response.data || response || []);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load departments',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const loadEmployees = async () => {
        try {
            const employees = await employeeService.getAllEmployees();
            // Map employeeId to employee name for quick lookup
            const map = {};
            employees.forEach(emp => {
                map[emp.employeeId] = emp.firstName + ' ' + emp.lastName;
            });
            setEmployeeMap(map);
        } catch (error) {
            // Optionally show error toast
        }
    };

    const handleEdit = (department) => {
        setEditDepartment(department);
        setFormName(department.name);
        setFormHead(department.headEmployeeId || null);
        setShowEditDialog(true);
    };

    const handleSaveEdit = async () => {
        try {
            await departmentService.updateDepartment(editDepartment.departmentId, {
                name: formName,
                headEmployeeId: formHead
            });
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Department updated',
                life: 2000
            });
            setShowEditDialog(false);
            setEditDepartment(null);
            loadDepartments();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update department',
                life: 3000
            });
        }
    };

    const handleSaveCreate = async () => {
        try {
            await departmentService.createDepartment({
                name: formName,
                headEmployeeId: formHead
            });
            toast.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Department created',
                life: 2000
            });
            setShowCreateDialog(false);
            setFormName('');
            setFormHead(null);
            loadDepartments();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to create department',
                life: 3000
            });
        }
    };

    const handleDelete = async (departmentId) => {
        if (!window.confirm('Are you sure you want to delete this department?')) return;
        try {
            await departmentService.deleteDepartment(departmentId);
            toast.current?.show({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Department deleted',
                life: 2000
            });
            loadDepartments();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete department',
                life: 3000
            });
        }
    };

    const employeeOptions = Object.entries(employeeMap).map(([id, name]) => ({ label: name, value: parseInt(id) }));

    return (
        <div className="department-list">
            <Toast ref={toast} />
            <div className="department-list-content w-full">
                <h2 className="m-0">Departments</h2>
                <div className="flex justify-content-end mb-3">
                    <Button label="New Department" icon="pi pi-plus" className="p-button-success" onClick={() => setShowCreateDialog(true)} />
                </div>
                <div className="card">
                    <DataTable value={departments} loading={loading} paginator rows={10} emptyMessage="No departments found">
                        <Column field="name" header="Name" sortable />
                        <Column field="headEmployeeId" header="Head" body={(rowData) => (
                            rowData.headEmployeeId ? employeeMap[rowData.headEmployeeId] : 'Unassigned'
                        )} />
                        <Column header="Actions" body={(rowData) => (
                            <div className="flex gap-2">
                                <Button icon="pi pi-pencil" className="p-button-text" onClick={() => handleEdit(rowData)} />
                                <Button icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => handleDelete(rowData.departmentId)} />
                            </div>
                        )} />
                    </DataTable>
                </div>
            </div>
            {/* Create Department Dialog */}
            <Dialog visible={showCreateDialog} header="Create New Department" modal onHide={() => setShowCreateDialog(false)}>
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="deptName">Department Name</label>
                        <input id="deptName" type="text" value={formName} onChange={e => setFormName(e.target.value)} className="p-inputtext" />
                    </div>
                    <div className="field">
                        <label htmlFor="deptHead">Department Head</label>
                        <Dropdown id="deptHead" value={formHead} options={employeeOptions} onChange={e => setFormHead(e.value)} placeholder="Select Head (optional)" showClear className="w-full" />
                    </div>
                    <div className="flex justify-content-end mt-3">
                        <Button label="Create" icon="pi pi-check" className="p-button-success" onClick={handleSaveCreate} disabled={!formName} />
                    </div>
                </div>
            </Dialog>
            {/* Edit Department Dialog */}
            <Dialog visible={showEditDialog} header="Edit Department" modal onHide={() => setShowEditDialog(false)}>
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="editDeptName">Department Name</label>
                        <input id="editDeptName" type="text" value={formName} onChange={e => setFormName(e.target.value)} className="p-inputtext" />
                    </div>
                    <div className="field">
                        <label htmlFor="editDeptHead">Department Head</label>
                        <Dropdown id="editDeptHead" value={formHead} options={employeeOptions} onChange={e => setFormHead(e.value)} placeholder="Select Head (optional)" showClear className="w-full" />
                    </div>
                    <div className="flex justify-content-end mt-3">
                        <Button label="Save" icon="pi pi-check" className="p-button-success" onClick={handleSaveEdit} disabled={!formName} />
                    </div>
                </div>
            </Dialog>
            <Dialog visible={showDialog} header="Department Details" modal onHide={() => setShowDialog(false)}>
                {selectedDepartment && (
                    <div>
                        <p><strong>Name:</strong> {selectedDepartment.name}</p>
                        <p><strong>Head:</strong> {selectedDepartment.headEmployeeId ? employeeMap[selectedDepartment.headEmployeeId] : 'Unassigned'}</p>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default DepartmentList;
