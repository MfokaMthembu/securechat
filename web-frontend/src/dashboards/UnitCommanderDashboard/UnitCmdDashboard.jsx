import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axios';  
import './UnitCmd.css';

function UnitCmd () {
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
            <h2>Unit Commander</h2>
                <nav>
                    <a href="#" onClick={() => navigate("/subadmin/assign-members")}> Unit Members </a>
                    <a href="#"  onClick={() => navigate("/subadmin/view-messages")}>Messages</a>
                    <a href="#" onClick={() => navigate("/subadmin/alerts")}>Alerts</a>
                    <a href="#" onClick={handleLogOut}>Logout</a>
                </nav>
            </aside>

            <main className="main-content">
                <header>
                    <h1> Dashboard </h1>
                    <p>Manage your unit’s communication and alerts.</p>
                </header>

                <section className="cards">
                    <div className="card" onClick={() => navigate("/subadmin/assign-members")}>
                        <h3>Unit Members</h3>
                        <p>View and manage all personnel in your unit.</p>
                    </div>

                    <div className="card" onClick={() => navigate("/alerts")}>
                        <h3>Emergency Alerts</h3>
                        <p>Send urgent messages to your unit instantly.</p>
                    </div>

                    <div className="card" onClick={() => navigate("/subadmin/view-messages")}>
                        <h3>Messages</h3>
                        <p>View and send messages</p>
                    </div>
                </section>
            </main>
        </div>
    </div>
    )
}

export default UnitCmd;