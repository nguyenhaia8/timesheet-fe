import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { projectService } from '../../services/projectService';
import clientService from '../../services/clientService';
import { Dropdown } from 'primereact/dropdown';
import './ProjectList.css';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
    const [formName, setFormName] = useState('');
    const [formStatus, setFormStatus] = useState('PLANNING');
    const [formClient, setFormClient] = useState(null);
    const [clients, setClients] = useState([]);
    const toast = React.useRef(null);

    useEffect(() => {
        loadProjects();
        loadClients();
    }, []);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const response = await projectService.getProjects();
            setProjects(response.data || response || []);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load projects',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const loadClients = async () => {
        try {
            const response = await clientService.getClients();
            // If response is array, use directly; else use response.data
            setClients(Array.isArray(response) ? response : response.data || []);
        } catch (error) {
            // Optionally show error toast
        }
    };

    const clientOptions = clients.map(client => ({ label: client.clientName, value: client.clientId }));
    const statusOptions = [
        { label: 'Planning', value: 'PLANNING' },
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Cancelled', value: 'CANCELLED' }
    ];

    const handleEdit = (project) => {
        setSelectedProject(project);
        setShowEditDialog(true);
    };

    const handleDelete = async (projectId) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await projectService.deleteProject(projectId);
            toast.current?.show({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Project deleted',
                life: 2000
            });
            loadProjects();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete project',
                life: 3000
            });
        }
    };

    const openAddDialog = () => {
        setFormMode('add');
        setFormName('');
        setFormStatus('PLANNING');
        setFormClient(null);
        setShowCreateDialog(true);
    };

    const openEditDialog = (project) => {
        setFormMode('edit');
        setFormName(project.name);
        setFormStatus(project.status);
        setFormClient(project.clientId);
        setSelectedProject(project);
        setShowEditDialog(true);
    };

    const handleSave = async () => {
        const projectData = { name: formName, status: formStatus, clientId: formClient };
        try {
            if (formMode === 'add') {
                await projectService.addProject(projectData);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Added',
                    detail: 'Project added',
                    life: 2000
                });
            } else {
                await projectService.updateProject(selectedProject.projectId, projectData);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Updated',
                    detail: 'Project updated',
                    life: 2000
                });
            }
            setShowCreateDialog(false);
            setShowEditDialog(false);
            loadProjects();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: `Failed to ${formMode === 'add' ? 'add' : 'update'} project`,
                life: 3000
            });
        }
    };

    return (
        <div className="project-list">
            <Toast ref={toast} />
            <div className="flex justify-content-between align-items-center mb-3">
                <h2 className="m-0">Projects</h2>
                <Button label="New Project" icon="pi pi-plus" className="p-button-success" onClick={openAddDialog} />
            </div>
            <div className="card">
                <DataTable value={projects} loading={loading} paginator rows={10} emptyMessage="No projects found">
                    <Column field="name" header="Name" sortable />
                    <Column field="status" header="Status" sortable />
                    <Column header="Actions" body={(rowData) => (
                        <div className="flex gap-2">
                            <Button icon="pi pi-pencil" className="p-button-text" onClick={() => openEditDialog(rowData)} />
                            <Button icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => handleDelete(rowData.projectId)} />
                        </div>
                    )} />
                </DataTable>
            </div>
            {/* Add/Edit Project Dialog */}
            <Dialog visible={showCreateDialog || showEditDialog} header={formMode === 'add' ? 'Add Project' : 'Edit Project'} modal onHide={() => { setShowCreateDialog(false); setShowEditDialog(false); }}>
                <div className="p-fluid">
                    <div className="field">
                        <label htmlFor="projectName">Project Name</label>
                        <input id="projectName" type="text" value={formName} onChange={e => setFormName(e.target.value)} className="p-inputtext" />
                    </div>
                    <div className="field">
                        <label htmlFor="projectStatus">Status</label>
                        <Dropdown id="projectStatus" value={formStatus} options={statusOptions} onChange={e => setFormStatus(e.value)} className="w-full" />
                    </div>
                    <div className="field">
                        <label htmlFor="projectClient">Client</label>
                        <Dropdown id="projectClient" value={formClient} options={clientOptions} onChange={e => setFormClient(e.value)} placeholder="Select Client" className="w-full" />
                    </div>
                    <div className="flex justify-content-end mt-3">
                        <Button label={formMode === 'add' ? 'Add' : 'Save'} icon="pi pi-check" className="p-button-success" disabled={!formName || !formClient} onClick={handleSave} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default ProjectList;
