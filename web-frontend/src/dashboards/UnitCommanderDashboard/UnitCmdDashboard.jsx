import { useState } from 'react';
//import axiosInstance from './services/axios';  
import './UnitCmd.css';

function UnitCmd () {

    const handleLogout = () => {
        console.log("Logging out...");
    };

    const handleMembers = () => {
        console.log("Logging out...");
    };


    return (
    <div className="root">
        <div className="dashboard">
            <aside className="sidebar">
            <h2>Unit Commander</h2>
                <nav>
                    <a href="#" onClick={handleMembers}>View Unit Members</a>
                    <a href="#">Send Alert</a>
                    <a href="#">View Incoming Alerts</a>
                    <a href="#" >Messages</a>
                    <a href="#" onClick={handleLogout}>Logout</a>
                </nav>
            </aside>

            <main className="main-content">
                <header>
                    <h1>Welcome, Commander</h1>
                    <p>Manage your unit’s communication and alerts.</p>
                </header>

                <section className="cards">
                    <div className="card"  onClick={handleMembers}>
                        <h3>Unit Members</h3>
                        <p>View and manage all personnel in your unit.</p>
                    </div>

                    <div className="card">
                        <h3>Emergency Alerts</h3>
                        <p>Send urgent messages to your unit instantly.</p>
                    </div>

                    <div className="card">
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