import { useState } from 'react';
//import axiosInstance from './services/axios';  
import './Personnel.css';

function Personnel () {
    const handleMessages = () => {
        console.log("Logging out...");
    };

    const handleGroup = () => {
        console.log("Logging out...");
    };

    const handleCommander = () => {
        console.log("Logging out...");
    };

    const handleAlerts = () => {
        console.log("Logging out...");
    };

    const handleLogout = () => {
        console.log("Logging out...");
    };

    return (
    <div className="root">
        <div className="dashboard">
            <aside className="sidebar">
                <h2>Personnel</h2>
                <nav>
                    <a href="#" onclick={handleMessages}>Messages</a>
                    <a href="#" onclick={handleGroup}>Group Chats</a>
                    <a href="#" onclick={handleCommander}>My Commander</a>
                    <a href="#" onclick={handleAlerts}>Send Alerts</a>
                    <a href="#" onClick={handleLogout}>Logout</a>
                </nav>
            </aside>

            <main className="main-content">
                <h1>Personnel Dashboard</h1>
                    <div className="card-container">
                        <div className="card" onclick={handleMessages}>
                            <h3>View Messages</h3>
                            <p>See new messages.</p>
                        </div>

                        <div className="card" onclick={handleGroup}>
                            <h3>Group Chats</h3>
                            <p>Communicate with your unit and fellow soldiers.</p>
                        </div>

                        <div className="card" onclick={handleCommander}>
                            <h3>My Commander</h3>
                            <p>View your assigned commander and contact details.</p>
                        </div>

                        <div className="card" onclick={handleAlerts}>
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