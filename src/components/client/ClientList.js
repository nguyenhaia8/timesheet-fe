import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import clientService from '../../services/clientService';
import './ClientList.css';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [formData, setFormData] = useState({ clientId: '', clientName: '', contactEmail: '', contactPhone: '', address: '' });
    const [isEdit, setIsEdit] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const data = await clientService.getClients();
            setClients(data);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch clients' });
        }
    };

    const openNew = () => {
        setFormData({ clientId: '', clientName: '', contactEmail: '', contactPhone: '', address: '' });
        setIsEdit(false);
        setDialogVisible(true);
    };

    const openEdit = (client) => {
        // Ensure clientId is set from the table row
        setFormData({
            clientId: client.clientId,
            clientName: client.clientName || '',
            contactEmail: client.contactEmail || '',
            contactPhone: client.contactPhone || '',
            address: client.address || ''
        });
        setIsEdit(true);
        setDialogVisible(true);
    };

    const hideDialog = () => {
        setDialogVisible(false);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const saveClient = async () => {
        try {
            if (isEdit) {
                if (!formData.clientId) {
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Client ID is missing for update.' });
                    return;
                }
                await clientService.updateClient({ ...formData, clientId: formData.clientId });
                toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Client updated successfully' });
            } else {
                await clientService.addClient(formData);
                toast.current.show({ severity: 'success', summary: 'Added', detail: 'Client added successfully' });
            }
            setDialogVisible(false);
            fetchClients();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to save client' });
        }
    };

    const deleteClient = async (client) => {
        try {
            await clientService.deleteClient(client.clientId);
            toast.current.show({ severity: 'success', summary: 'Deleted', detail: 'Client deleted successfully' });
            fetchClients();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete client' });
        }
    };

    const actionBodyTemplate = (rowData) => (
        <>
            <Button icon="pi pi-pencil" className="p-button-text" onClick={() => openEdit(rowData)} />
            <Button icon="pi pi-trash" className="p-button-text p-button-danger" onClick={() => deleteClient(rowData)} />
        </>
    );

    return (
        <div className="client-list-container">
            <Toast ref={toast} />
            <div className="client-list-header">
                <h2>Clients</h2>
                <Button label="Add Client" icon="pi pi-plus" className="p-button-success" onClick={openNew} />
            </div>
            <DataTable value={clients} paginator rows={10} selectionMode="single" selection={selectedClient} onSelectionChange={e => setSelectedClient(e.value)}>
                <Column field="clientName" header="Name" sortable />
                <Column field="contactEmail" header="Email" />
                <Column field="contactPhone" header="Phone" />
                <Column field="address" header="Address" />
                <Column body={actionBodyTemplate} header="Actions" />
            </DataTable>
            <Dialog visible={dialogVisible} style={{ width: '400px' }} header={isEdit ? 'Edit Client' : 'Add Client'} modal onHide={hideDialog}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="clientName">Name</label>
                        <InputText id="clientName" value={formData.clientName} onChange={e => handleInputChange('clientName', e.target.value)} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="contactEmail">Email</label>
                        <InputText id="contactEmail" value={formData.contactEmail} onChange={e => handleInputChange('contactEmail', e.target.value)} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="contactPhone">Phone</label>
                        <InputText id="contactPhone" value={formData.contactPhone} onChange={e => handleInputChange('contactPhone', e.target.value)} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="address">Address</label>
                        <InputText id="address" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} />
                    </div>
                </div>
                <div className="dialog-footer">
                    <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
                    <Button label={isEdit ? 'Update' : 'Add'} icon="pi pi-check" className="p-button-success" onClick={saveClient} />
                </div>
            </Dialog>
        </div>
    );
};

export default ClientList;
