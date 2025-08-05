import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import './Dashboard.css';

const Dashboard = ({ user }) => {
    const quickActions = [
        {
            label: 'Create Timesheet',
            icon: 'pi pi-plus',
            color: 'primary',
            action: () => console.log('Create timesheet')
        },
        {
            label: 'View Current Week',
            icon: 'pi pi-calendar',
            color: 'info',
            action: () => console.log('View current week')
        },
        {
            label: 'Submit for Approval',
            icon: 'pi pi-send',
            color: 'success',
            action: () => console.log('Submit for approval')
        },
        {
            label: 'View Reports',
            icon: 'pi pi-chart-bar',
            color: 'warning',
            action: () => console.log('View reports')
        }
    ];

    const stats = [
        {
            title: 'Hours This Week',
            value: '32.5',
            icon: 'pi pi-clock',
            color: 'blue'
        },
        {
            title: 'Active Projects',
            value: '4',
            icon: 'pi pi-briefcase',
            color: 'green'
        },
        {
            title: 'Pending Approvals',
            value: '2',
            icon: 'pi pi-exclamation-circle',
            color: 'orange'
        },
        {
            title: 'Completed This Month',
            value: '128.5',
            icon: 'pi pi-check-circle',
            color: 'purple'
        }
    ];

    return (
        <div className="dashboard">
            <div className="page-header">
                <h1 className="page-title">
                    Welcome back, {user?.firstName}!
                </h1>
                <p className="page-subtitle">
                    Here's your timesheet overview for today
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid mb-4">
                {stats.map((stat, index) => (
                    <div key={index} className="col-12 md:col-6 lg:col-3">
                        <Card className="stats-card">
                            <div className="flex align-items-center">
                                <div className={`stats-icon bg-${stat.color}-100 text-${stat.color}-600`}>
                                    <i className={stat.icon}></i>
                                </div>
                                <div className="ml-3">
                                    <div className="text-2xl font-bold text-900">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-600">
                                        {stat.title}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid">
                <div className="col-12 lg:col-8">
                    <Card title="Quick Actions" className="h-full">
                        <div className="grid">
                            {quickActions.map((action, index) => (
                                <div key={index} className="col-12 sm:col-6">
                                    <Button
                                        label={action.label}
                                        icon={action.icon}
                                        className={`p-button-${action.color} w-full mb-2`}
                                        onClick={action.action}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="col-12 lg:col-4">
                    <Card title="Recent Activity" className="h-full">
                        <div className="activity-list">
                            <div className="activity-item">
                                <i className="pi pi-check-circle text-green-500"></i>
                                <div className="ml-2">
                                    <div className="text-sm font-medium">Timesheet Approved</div>
                                    <div className="text-xs text-600">2 hours ago</div>
                                </div>
                            </div>
                            <div className="activity-item">
                                <i className="pi pi-clock text-blue-500"></i>
                                <div className="ml-2">
                                    <div className="text-sm font-medium">8 hours logged</div>
                                    <div className="text-xs text-600">Yesterday</div>
                                </div>
                            </div>
                            <div className="activity-item">
                                <i className="pi pi-plus text-purple-500"></i>
                                <div className="ml-2">
                                    <div className="text-sm font-medium">New project assigned</div>
                                    <div className="text-xs text-600">3 days ago</div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
