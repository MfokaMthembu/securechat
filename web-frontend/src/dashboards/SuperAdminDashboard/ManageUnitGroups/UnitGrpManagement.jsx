import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../services/axios';
import UnitGrpForm from './UnitGrpForm';
import '../Admin.css';
import './UnitGrp.css'; 
import UnitGrpList from './UnitGrpList';

function UnitGrpManagement() {
    // navigation hook to handle routing between pages
    const navigate = useNavigate();
    
    // function to handle user management navigation
    const handleManageUsers = () => {
        navigate("/superadmin/manage-users");
    };

    const handleManageGroupChats = () => {
        navigate("/superadmin/manage-group-chats");
    };

    // state to manage modal (UnitGrpForm) visibility for adding new users
    const [isModalOpen, setIsModalOpen] = useState(false);
    // functions to open and close the modal
    const openAddGrpModal = () => setIsModalOpen(true);
    const closeAddGrpModal = () => setIsModalOpen(false);

    // function to handle group creation
    const handleCreateGroup = async (data) => {
        try {
            await axiosInstance.post('/api/superadmin/create-group', data);
            alert('Unit Group created successfully');
            closeAddGrpModal();
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert('Failed to create group');
        }
    };

    // function to fetch users from the server
    const [unit_groups, setGroups] = useState([]);

    function fetchUnitGroups() {
        axiosInstance.get('/api/superadmin/groups')
        .then(function(res) {
            setGroups(res.data.data || []);
        })
        .catch(function(err) {
            console.error('Error fetching groups:', err.response?.data || err.message);
        });
    }


    // function to handle update group
    const handleUpdateGroup = async (data) => {
        try {
            await axiosInstance.post('/api/superadmin/update-group', data);
            alert('Unit Group updated successfully');
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert('Failed to update group');
        }

    };

    // function to handle group deletion
    function handleDelete(id) {
        if (!window.confirm('Are you sure you want to delete this group?')) return;

        axiosInstance.delete(`/api/superadmin/delete-group/${id}`)
        .then(function() {
            fetchUnitGroups();
        })
        .catch(function(err) {
            console.error('Delete failed:');
        });
    }

    useEffect(function() {
        fetchUnitGroups();
    }, []);

    return (
        <div className="root">
            <div className="dashboard">
                {/* Sidebar */}
                <aside className="sidebar">
                    <h2>System Admin</h2>
                    <nav>
                        <a href="#" onClick={handleManageUsers}>Manage Users</a>
                        <a href="#">Assign Commanders</a>
                        <a href="#">Revoke Roles</a>
                        <a href="#" onClick={handleManageGroupChats}>Manage Group Chats</a>
                        <a href="#">Logout</a>
                    </nav>
                </aside>

                {/* Main content */}
                <main className="main-content">
                    <div className="header-container"> 
                        <h1 className="headings"> Manage Groups </h1>
                        <div className="search-container">
                            <input  type="text" id="search-box" placeholder="Search by group_id or name"/>
                            <button >Search</button>
                        </div>
                    </div>    
                    {/* Add Group Button */}
                    <div className="add-grp-container">
                        <button className="add-grp-btn" onClick={openAddGrpModal}>
                            <span className="icon">👤👤</span>
                            <span>Add New Unit Group</span>
                        </button>
                    </div>

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="modal" style={{ display: 'block' }}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h2 className="modal-title">Add New Unit Group</h2>
                                    <button className="close-btn" onClick={closeAddGrpModal}>&times;</button>
                                </div>
                                <div className="modal-body">
                                    <UnitGrpForm 
                                        onClose={closeAddGrpModal} 
                                        onSubmit={handleCreateGroup} 
                                    />
                                </div>
                            </div>
                        </div>
                    )} 
                    {/* Unit Group List */}
                    <div>
                        <UnitGrpList 
                            unit_groups={unit_groups}
                            onEdit={handleUpdateGroup} 
                            onDelete={handleDelete}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}

export default UnitGrpManagement;
