import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupMessage from '../../../components/GroupMessages/GroupMessage';
import './UnitCommMessages.css';
import '../UnitCmd.css';
import axiosInstance from '../../../services/axios';


export default function UnitCommanderMessages() {
    const navigate = useNavigate();
    const [showGroupChat, setShowGroupChat] = useState(false);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserGroups = () => {
         axiosInstance.get('/api/user-groups')
                    .then(res => {  
                    setGroups(res.data.groups || []);  
                    setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setGroups([]); 
                setLoading(false);
            });    
    }
        useEffect(() => fetchUserGroups(), []); 

    const openGroupChat = (group) => {
        setSelectedGroup(group);
        setShowGroupChat(true);
    };

    const backToMessages = () => {
        setShowGroupChat(false);
        setSelectedGroup(null);
    };

    if (loading) return <p>Loading groups...</p>;

    if (showGroupChat && selectedGroup) {
        return (
            <div className="root">
                <div className="dashboard">
                    <aside className="sidebar">
                        <h2>Unit Commander</h2>
                        <nav>
                            <a href="#" onClick={() => navigate("/subadmin/assign-members")}>Unit Members</a>
                            <a href="#" onClick={() => navigate("/subadmin/view-messages")}>Messages</a>
                            <a href="#" nClick={() => navigate("/alerts")}>Alerts</a>
                            <a href="#">Logout</a>
                        </nav>
                    </aside>

                    <main className="main-content">
                        <GroupMessage 
                            group={selectedGroup}
                            onBack={backToMessages}
                        />
                    </main>
                </div>
            </div>
        );
    }

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
                        <a href="#" onClick={() => navigate("/subadmin/assign-members")}>Unit Members</a>
                        <a href="#" onClick={() => navigate("/subadmin/view-messages")}>Messages</a>
                        <a href="#" onClick={() => navigate("/subadmin/alerts")}>Alerts</a>
                        <a href="#" onClick={handleLogOut}>Logout</a>
                    </nav>
                </aside>

                <main className="main-content">
                    <header>
                        <h1>Messages</h1>
                        <p>View & Send your messages and group chats</p>
                    </header>

                    <div className="group-cards-container">   
                        {groups.length > 0 ? (
                            groups.map(group => (
                                <div 
                                    key={group.id} 
                                    className="group-card" 
                                    onClick={() => openGroupChat(group)}
                                >
                                    <div className="group-card-icon">
                                        <div className="default-icon">
                                            <span>{group.grp_name.charAt(0)}</span>
                                        </div>
                                    </div>
                                    <div className="group-card-content">
                                        <h2>{group.grp_name}</h2>
                                        <p>{group.grp_description}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>You have not been added or assigned to any group yet.</p>
                        )}
                    </div>
                </main>
            </div>
        </div> 
    );
}
