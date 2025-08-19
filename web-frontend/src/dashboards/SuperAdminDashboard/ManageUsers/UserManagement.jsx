import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../services/axios';
import UserForm from './UserForm';
import '../Admin.css';
import './UserMan.css'; 
import UserList from './UserList';

function UserManagement() {
    // navigation hook to handle routing between pages
    const navigate = useNavigate();
    
    // function to handle user management navigation
    const handleManageUsers = () => {
        navigate("/superadmin/manage-users");
    };

    const handleManageGroupChats = () => {
        navigate("/superadmin/manage-group-chats");
    };

    // state to manage modal (UserForm) visibility for adding new users
    const [isModalOpen, setIsModalOpen] = useState(false);
    // functions to open and close the modal
    const openAddUserModal = () => setIsModalOpen(true);
    const closeAddUserModal = () => setIsModalOpen(false);

    // function to handle user creation
    const handleCreateUser = async (data) => {
        try {
            await axiosInstance.post('/api/superadmin/create-user', data);
            alert('User created successfully');
            closeAddUserModal();
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert('Failed to create user');
        }
    };

    // function to fetch users from the server
    const [users, setUsers] = useState([]);

    function fetchUsers() {
        axiosInstance.get('/api/superadmin/users')
        .then(function(res) {
            setUsers(res.data.data || []);
        })
        .catch(function(err) {
            console.error('Error fetching users:', err.response?.data || err.message);
        });
    }

    // function to handle user editing
    function handleEdit(user) {
        axiosInstance.edit('/api/superadmin/update-user/')
    }

    // function to handle user deletion
    function handleDelete(id) {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        axiosInstance.delete(`/api/superadmin/delete-user/${id}`)
        .then(function() {
            fetchUsers();
        })
        .catch(function(err) {
            console.error('Delete failed:');
        });
    }

    useEffect(function() {
        fetchUsers();
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
                        <h1 className="headings"> Manage Users </h1>
                        <div className="search-container">
                            <input  type="text" id="search-box" placeholder="Search by ID, Name, Email, Unit, Rank"/>
                            <button >Search</button>
                        </div>
                    </div>    
                    {/* Add User Button */}
                    <div className="add-user-container">
                        <button className="add-user-btn" onClick={openAddUserModal}>
                            <span className="icon">👤</span>
                            <span>Add New User</span>
                        </button>
                    </div>

                    {/* Modal */}
                    {isModalOpen && (
                        <div className="modal" style={{ display: 'block' }}>
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h2 className="modal-title">Add New User</h2>
                                    <button className="close-btn" onClick={closeAddUserModal}>&times;</button>
                                </div>
                                <div className="modal-body">
                                    <UserForm 
                                        onClose={closeAddUserModal} 
                                        onSubmit={handleCreateUser} 
                                    />
                                </div>
                            </div>
                        </div>
                    )} 
                    {/* User List */}
                    <div>
                        <UserList
                            users={users} 
                            onEdit={handleEdit} 
                            onDelete={handleDelete}
                        />
                    </div>
                </main>
            </div>
         </div>          
        )
}

export default UserManagement;
