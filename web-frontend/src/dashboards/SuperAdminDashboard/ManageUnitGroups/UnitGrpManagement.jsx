import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../services/axios';
import UnitGrpForm from './UnitGrpForm';
import '../Admin.css';
import './UnitGrp.css'; 
import UnitGrpList from './UnitGrpList';

function UnitGrpManagement() {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGroups, setEditingGroups] = useState(null);
    const [groups, setGroups] = useState([]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setEditingGroups(null);
        setIsModalOpen(false);
    };

    // function to fetch groups from the database
    const fetchUnitGroups = () => {
        axiosInstance.get('/api/superadmin/get-groups')
            .then(res => setGroups(res.data.data || []))
            .catch(err => console.error(err.response?.data || err.message));
    };

    useEffect(() => { fetchUnitGroups(); }, []);

    // function to handle unit group creation or update
    const handleSubmitGroup = async (data) => {
        try {
            if (editingGroups) {
                await axiosInstance.put(`/api/superadmin/update-group/${editingGroups.id}`, data);
                alert('Group updated successfully');
            } else {
                await axiosInstance.post('/api/superadmin/create-group', data);
                alert('Group created successfully');
            }
            closeModal();
            fetchUnitGroups();
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert(editingUser ? 'Failed to update group' : 'Failed to create group');
        }
    };

    // function to handle adding a new group
    const handleAddGroup = () => {
        // Reset editing groups for new creation
        setEditingGroups(null); 
        openModal();
    };

    // function to handle groups editing
    const handleEdit = (groups) => {
        setEditingGroups(groups);
        openModal();
    };

    // function to handle groups deletion
    const handleDelete = (id) => {
        if (!window.confirm('Are you sure you want to delete this group?')) return;

        axiosInstance.delete(`/api/superadmin/delete-group/${id}`)
            .then(() => fetchUnitGroups())
            .catch(err => console.error(err.response?.data || err.message));
    };

    // function to handle search
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearch = async () => {
        if (!searchTerm || searchTerm.length < 2) {
            fetchUnitGroups();
            return;
        }

        try {
            const response = await axiosInstance.get('/api/superadmin/search-group', {
            params: {
                search: searchTerm,
            }
            });

            console.log("Search response:", response.data);
            setGroups(response.data.data || []);
        } catch (err) {
            console.error("Search failed:", err.response?.data || err.message);
            setGroups([]);
        }
    };
    
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
                        <a href="#">Revoke Roles</a>
                        <a href="#" onClick={() => navigate("/superadmin/manage-group-chats")}>Manage Group Chats</a>
                        <a href="#" onClick={handleLogOut}>Logout</a>
                    </nav>
                </aside>

                {/* Main content */}
                <main className="main-content">
                    <div className="header-container"> 
                        <h1 className="headings"> Manage Groups </h1>
                        <div className="search-container">
                            <input  type="text" id="search-box" 
                                placeholder="Search..."  
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                            <button onClick={handleSearch}>Search</button>
                        </div>
                    </div>    

                    {/* Add Group Button */}
                    <div className="add-grp-container">
                        <button className="add-grp-btn" onClick={handleAddGroup}>
                            <span className="icon">👤👤</span>
                            <span>Add New Unit Group</span>
                        </button>
                    </div>

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="modal" style={{ display: 'block' }}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h2 className="modal-title">{editingGroups ? 'Edit Group' : 'Add New Group'}</h2>
                                    <button className="close-btn" onClick={closeModal}>&times;</button>
                                </div>
                                <div className="modal-body">
                                    <UnitGrpForm 
                                        onClose={closeModal} 
                                        onSubmit={handleSubmitGroup} 
                                        groups={editingGroups}
                                    />
                                </div>
                            </div>
                        </div>
                    )} 
                    {/* Unit Group List */}
                    <div>
                        <UnitGrpList 
                            groups={groups}
                            onEdit={handleEdit} 
                            onDelete={handleDelete}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default UnitGrpManagement;
