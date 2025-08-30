import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axios';  
import './Personnel.css';

function Personnel () {
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
            <aside className="sidebar">
                <h2>Personnel</h2>
                <nav>
                    <a href="#" >Messages</a>
                    <a href="#" onClick={() => navigate("/personnel/view-messages")}>Group Chats</a>
                    <a href="#" onClick={() => navigate("/personnel/alerts")}>Send Alerts</a>
                    <a href="#" onClick={handleLogOut}>Logout</a>
                </nav>
            </aside>

            <main className="main-content">
                <h1>Personnel Dashboard</h1>
                    <div className="card-container">
                        <div className="card" >
                            <h3>View Messages</h3>
                            <p>See new messages.</p>
                        </div>

                        <div className="card" onClick={() => navigate("/personnel/view-messages")}>
                            <h3>Group Chats</h3>
                            <p>Communicate with your unit and fellow soldiers.</p>
                        </div>

                        <div className="card" onClick={() => navigate("/alerts")}>
                            <h3>Send Alerts</h3>
                            <p>Send incident or daily reports directly to command.</p>
                        </div>
                    </div>
            </main>
        </div>
    </div>
    )

}

export default Personnel;