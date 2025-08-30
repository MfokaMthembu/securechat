import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

function Admin() {
    const navigate = useNavigate();

    // function to handle logout
    const handleLogOut = async () => {
        try {
            await axiosInstance.post(`/api/logout`);
            console.log(`user logged out successfully`);
            navigate('/');
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert('Failed to logout');
        }
    }

    return (
        <div className="root">
            <div className="dashboard">
                 {/* Sidebar */}
                <aside className="sidebar">
                    <h2>System Admin</h2>
                    <nav>
                        <a href="#" onClick={() => navigate("/superadmin/manage-users")}>Manage Users</a>
                        <a href="#" >Revoke Roles</a>
                        <a href="#" onClick={() => navigate("/superadmin/manage-group-chats")}>Manage Group Chats</a>
                        <a href="#" onClick={handleLogOut}>Logout</a>
                    </nav>
                </aside>

                {/* Main content */}
                <main className="main-content">
                    <h1 id="page-title">Dashboard Overview</h1>
                    <div id="content-area">
                        <div className="card-container">
                            <div className="card" onClick={() => navigate("/superadmin/manage-users")}>
                                <h3>Manage Users</h3>
                                <p>Create, edit, and deactivate user accounts.</p>
                            </div>

                            <div className="card" >
                                <h3>Revoke Roles</h3>
                                <p>Remove or update roles from any personnel.</p>
                            </div>

                            <div className="card" onClick={() => navigate("/superadmin/manage-group-chats")}>
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
