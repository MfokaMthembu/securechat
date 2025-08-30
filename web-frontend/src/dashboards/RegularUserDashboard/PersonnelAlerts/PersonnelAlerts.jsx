import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../services/axios';
import AlertIcon from '../../../images/icons8-alarm-96.png';
import './PersonnelAlerts.css';

export default function PersonnelAlerts () {
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
                    <h2> Personnel </h2>
                    <nav>
                        <a href="#" >Messages</a>
                        <a href="#" onClick={() => navigate("/personnel/view-messages")}>Group Chats</a>
                        <a href="#" onClick={() => navigate("/personnel/alerts")}>Send Alerts</a>
                        <a href="#" onClick={handleLogOut}>Logout</a>
                    </nav>
                </aside>

                <main className="main-content">
                    <header>
                        <h1>Alerts</h1>
                        <p>View & Send your Alerts and tag them with location</p>
                    </header>

                    <div className="group-cards-container" onClick={() => navigate("/personnel/manage-alerts")}>  
                        <div className="group-card">
                            <div className="group-card-icon">
                                <div className="default-icon">
                                    <img src={AlertIcon} alt="Alert Icon" />
                                </div>
                            </div>

                            <div className="group-card-content">
                                <h2>Emergency Alerts</h2>
                                <p>Click to view or send emergency alerts with location.</p>
                            </div>
                        </div>                           
                    </div>
                </main>
            </div>
        </div> 
    );
}