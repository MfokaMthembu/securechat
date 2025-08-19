import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function Admin() {
    const navigate = useNavigate();

    const handleManageUsers = () => {
        navigate("/superadmin/manage-users");
    };

    const handleAssignCommanders = () => {
        console.log("Navigate to Assign Commanders");
    };

    const handleRevokeRoles = () => {
        console.log("Navigate to Revoke Roles");
    };

    const handleManageGroupChats = () => {
        navigate("/superadmin/manage-group-chats");
    };

    const handleLogout = () => {
        console.log("Logging out...");
    };

    return (
        <div className="root">
            <div className="dashboard">
                 {/* Sidebar */}
                <aside className="sidebar">
                    <h2>System Admin</h2>
                    <nav>
                        <a href="#" onClick={handleManageUsers}>Manage Users</a>
                        <a href="#" onClick={handleAssignCommanders}>Assign Commanders</a>
                        <a href="#" onClick={handleRevokeRoles}>Revoke Roles</a>
                        <a href="#" onClick={handleManageGroupChats}>Manage Group Chats</a>
                        <a href="#" onClick={handleLogout}>Logout</a>
                    </nav>
                </aside>

                {/* Main content */}
                <main className="main-content">
                    <h1 id="page-title">Dashboard Overview</h1>
                    <div id="content-area">
                        <div className="card-container">
                            <div className="card" onClick={handleManageUsers}>
                                <h3>Manage Users</h3>
                                <p>Create, edit, and deactivate user accounts.</p>
                            </div>

                            <div className="card" onClick={handleAssignCommanders}>
                                <h3>Assign Commanders</h3>
                                <p>Assign commanders to units and update responsibilities.</p>
                            </div>

                            <div className="card" onClick={handleRevokeRoles}>
                                <h3>Revoke Roles</h3>
                                <p>Remove or update roles from any personnel.</p>
                            </div>

                            <div className="card" onClick={handleManageGroupChats}>
                                <h3>Manage Group Chats</h3>
                                <p>Create, delete, or update group chat details.</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>    
    );
}

export default Admin;
