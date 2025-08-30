import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../services/axios';
import UserForm from './UserForm';
import UserList from './UserList';
import UnitGroupList from '../ManageUnitGroups/UnitGrpList';
import './UserMan.css';
import '../Admin.css';

function UserManagement() {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [users, setUsers] = useState([]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setEditingUser(null);
        setIsModalOpen(false);
    };

    const openAssignModal = () => setIsAssignModalOpen(true);
    const closeAssignModal = () => {
        setSelectedUser(null);
        setSelectedGroup(null);
        setIsAssignModalOpen(false);
    };

    // function to fetch users from the database
    const fetchUsers = () => {
        axiosInstance.get('/api/superadmin/users')
            .then(res => setUsers(res.data.data || []))
            .catch(err => console.error(err.response?.data || err.message));
    };

    useEffect(() => { fetchUsers(); }, []);

    // function to handle user creation or update
    const handleSubmitUser = async (data) => {
        try {
            if (editingUser) {
                await axiosInstance.put(`/api/superadmin/update-user/${editingUser.id}`, data);
                alert('User updated successfully');
            } else {
                await axiosInstance.post('/api/superadmin/create-user', data);
                alert('User created successfully');
            }
            closeModal();
            fetchUsers();
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert(editingUser ? 'Failed to update user' : 'Failed to create user');
        }
    };

    // function to handle adding a new user
    const handleAddUser = () => {
        // Reset editing user for new creation
        setEditingUser(null); 
        openModal();
    };

    // function to handle user editing
    const handleEdit = (user) => {
        setEditingUser(user);
        openModal();
    };

    // function to handle user deletion
    const handleDelete = (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        axiosInstance.delete(`/api/superadmin/delete-user/${id}`)
            .then(() => fetchUsers())
            .catch(err => console.error(err.response?.data || err.message));
    };

    // function to handle search
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearch = async () => {
        if (!searchTerm || searchTerm.length < 2) {
            fetchUsers();
            return;
        }

        try {
            const response = await axiosInstance.get('/api/superadmin/search-users', {
            params: {
                search: searchTerm,
                search_type: 'all',
                per_page: 10,
            }
            });

            console.log("Search response:", response.data);
            setUsers(response.data.data || []);
        } catch (err) {
            console.error("Search failed:", err.response?.data || err.message);
            setUsers([]);
        }
    };

    // function to handle user selection for assignment
    const handleUserSelect = (user) => {
        setSelectedUser(user);
    };

    // function to handle group selection in assignment modal
    const handleGroupSelect = (group) => {
        setSelectedGroup(group);
    };

    // function to handle user assignment to a group
    const handleAssignUser = () => {
        if (!selectedUser) {
            alert('Please select a user first');
            return;
        }
        openAssignModal();
    };

    // function to submit the assignment
    const handleSubmitAssignment = async () => {
        if (!selectedUser || !selectedGroup) {
            alert('Please select both a user and a group');
            return;
        }

        try {
                await axiosInstance.post(`/api/superadmin/groups/${selectedGroup.id}/assign-commander`, {
                user_id: selectedUser.id
                });

            console.log('User assigned to group:', selectedGroup.grp_name);
            
            alert('User assigned to group successfully');
            closeAssignModal();
            fetchUsers(); // Refresh the users list if needed
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert('Failed to assign user to group');
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
                <aside className="sidebar">
                    <h2>System Admin</h2>
                    <nav>
                        <a href="#" onClick={() => navigate("/superadmin/manage-users")}>Manage Users</a>
                        <a href="#">Revoke Roles</a>
                        <a href="#" onClick={() => navigate("/superadmin/manage-group-chats")}>Manage Group Chats</a>
                        <a href="#" onClick={handleLogOut}>Logout</a>
                    </nav>
                </aside>

                <main className="main-content">
                    <div className="header-container">
                        <h1 className="headings">Manage Users</h1>
                        <div className="search-container">
                            <input type="text" placeholder="Search..."  
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                            <button onClick={handleSearch}>Search</button>
                        </div>
                    </div>

                    <div className="add-user-container">
                        <button className="add-user-btn" onClick={handleAddUser}>
                            {editingUser ? 'Edit User' : 'Add New User'}
                        </button>
                    </div>

                    <div className="add-user-container">
                        <button 
                            className="add-user-btn" 
                            onClick={handleAssignUser}
                            disabled={!selectedUser}
                            style={{ 
                                backgroundColor: selectedUser ? '#28a745' : '#6c757d',
                                cursor: selectedUser ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Assign Selected User to Unit Group
                            {selectedUser && <span> ({selectedUser.username})</span>}
                        </button>
                    </div>

                    {/* User Form Modal */}
                    {isModalOpen && (
                        <div className="modal" style={{ display: 'block' }}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h2 className="modal-title">{editingUser ? 'Edit User' : 'Add New User'}</h2>
                                    <button className="close-btn" onClick={closeModal}>&times;</button>
                                </div>
                                <div className="modal-body">
                                    <UserForm
                                        onClose={closeModal}
                                        onSubmit={handleSubmitUser}
                                        user={editingUser}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Assignment Modal */}
                    {isAssignModalOpen && (
                        <div className="modal" style={{ display: 'block' }}>
                            <div className="modal-content assignment-modal">
                                <div className="modal-header">
                                    <h2 className="modal-title">
                                        Assign User to Unit Group
                                    </h2>
                                    <button className="close-btn" onClick={closeAssignModal}>&times;</button>
                                </div>
                                <div className="modal-body">
                                    {selectedUser && (
                                        <div className="selected-user-info">
                                            <p><strong>Selected User:</strong> {selectedUser.username} ({selectedUser.first_name} {selectedUser.last_name})</p>
                                        </div>
                                    )}
                                    <div className="unit-group-selection">
                                        <h3>Select Unit Group:</h3>
                                        <UnitGroupList 
                                            onGroupSelect={handleGroupSelect}
                                            selectedGroup={selectedGroup}
                                            selectionMode={true}
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button 
                                            className="submit-assignment-btn"
                                            onClick={handleSubmitAssignment}
                                            disabled={!selectedGroup}
                                            style={{ 
                                                backgroundColor: selectedGroup ? '#28a745' : '#6c757d',
                                                color: 'white',
                                                padding: '10px 20px',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: selectedGroup ? 'pointer' : 'not-allowed'
                                            }}
                                        >
                                            {selectedGroup ? `Assign to ${selectedGroup.grp_name}` : 'Select a Group'}
                                        </button>
                                        <button 
                                            className="cancel-btn"
                                            onClick={closeAssignModal}
                                            style={{ 
                                                backgroundColor: '#dc3545',
                                                color: 'white',
                                                padding: '10px 20px',
                                                border: 'none',
                                                borderRadius: '4px',
                                                marginLeft: '10px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <UserList
                        users={users}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onUserSelect={handleUserSelect}
                        selectedUser={selectedUser}
                        selectionMode={true}
                    />
            </main>
            </div>
        </div>
    );
}

export default UserManagement;