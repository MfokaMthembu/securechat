import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../services/axios';
import PersonnelList from '../../../components/PersonnelList/PersonnelList';
import UnitGroupList from '../../SuperAdminDashboard/ManageUnitGroups/UnitGrpList';
import './AssignMembers.css';
import '../UnitCmd.css';

function AssignGroupMembers () {
    const navigate = useNavigate();

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]); 
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [users, setUsers] = useState([]);

    const openAssignModal = () => setIsAssignModalOpen(true);
    const closeAssignModal = () => {
        setSelectedUsers([]); 
        setSelectedGroup(null);
        setIsAssignModalOpen(false);
    };

    // function to fetch users from the database
    const fetchUsers = () => {
        axiosInstance.get('/api/subadmin/get-users')
            .then(res => setUsers(res.data.data || []))
            .catch(err => console.error(err.response?.data || err.message));
    };

    useEffect(() => { fetchUsers(); }, []);

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

    // function to handle multiple user selection for assignment
    const handleUserSelect = (users) => {
        setSelectedUsers(users);
    };

    // function to handle group selection in assignment modal
    const handleGroupSelect = (group) => {
        setSelectedGroup(group);
    };

    // function to handle user assignment to a group
    const handleAssignUser = () => {
        if (!selectedUsers || selectedUsers.length === 0) {
            alert('Please select at least one user first');
            return;
        }
        openAssignModal();
    };

    // function to submit the assignment (multiple users)
    const handleSubmitAssignment = async () => {
        if (!selectedUsers || selectedUsers.length === 0 || !selectedGroup) {
            alert('Please select both users and a group');
            return;
        }

        try {
            await axiosInstance.post(`/api/subadmin/groups/${selectedGroup.id}/assign-member`, {
                user_ids: selectedUsers.map(user => user.id)  
            });

            console.log(`${selectedUsers.length} users assigned to group:`, selectedGroup.grp_name);
            
            alert(`${selectedUsers.length} users assigned to group successfully`);
            closeAssignModal();
            fetchUsers();
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert('Failed to assign users to group');
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
                    <h2>Unit Commander</h2>
                    <nav>
                        <a href="#" onClick={() => navigate("/subadmin/assign-members")}> Unit Members </a>
                        <a href="#"  onClick={() => navigate("/subadmin/view-messages")}>Messages</a>
                        <a href="#" onClick={() => navigate("/subadmin/alerts")}>Alerts</a>
                        <a href="#" onClick={handleLogOut}>Logout</a>
                    </nav>
                </aside>

                <main className="main-content">
                    <div className="header-container">
                        <h1 className="headings">Assign Users</h1>
                        <div className="search-container">
                            <input type="text" placeholder="Search..."  
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                            <button onClick={handleSearch}>Search</button>
                        </div>
                    </div>

                    <div className="add-user-container">
                        <button 
                            className="add-user-btn" 
                            onClick={handleAssignUser}
                            disabled={!selectedUsers || selectedUsers.length === 0}
                            style={{ 
                                backgroundColor: (selectedUsers && selectedUsers.length > 0) ? '#28a745' : '#6c757d',
                                cursor: (selectedUsers && selectedUsers.length > 0) ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Assign Selected Users to Unit Group
                            {selectedUsers && selectedUsers.length > 0 && (
                                <span> ({selectedUsers.length} selected)</span>
                            )}
                        </button>
                    </div>

                    {/* Assignment Modal */}
                    {isAssignModalOpen && (
                        <div className="modal" style={{ display: 'block' }}>
                            <div className="modal-content assignment-modal">
                                <div className="modal-header">
                                    <h2 className="modal-title">
                                        Assign Users to Unit Group
                                    </h2>
                                    <button className="close-btn" onClick={closeAssignModal}>&times;</button>
                                </div>
                                <div className="modal-body">
                                    {selectedUsers && selectedUsers.length > 0 && (
                                        <div className="selected-user-info">
                                            <p><strong>Selected Users ({selectedUsers.length}):</strong></p>
                                            <ul style={{ maxHeight: '100px', overflowY: 'auto', margin: '5px 0' }}>
                                                {selectedUsers.map(user => (
                                                    <li key={user.id}>
                                                        {user.username} ({user.userDetail?.first_name} {user.userDetail?.last_name})
                                                    </li>
                                                ))}
                                            </ul>
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
                                            {selectedGroup ? `Assign ${selectedUsers.length} users to ${selectedGroup.grp_name}` : 'Select a Group'}
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

                    <PersonnelList
                        users={users}
                        onUserSelect={handleUserSelect}
                        selectedUsers={selectedUsers} 
                        selectionMode={true}
                        multipleSelection={true} 
                    />
                </main>
            </div>
        </div>            
    )
} 

export default AssignGroupMembers;