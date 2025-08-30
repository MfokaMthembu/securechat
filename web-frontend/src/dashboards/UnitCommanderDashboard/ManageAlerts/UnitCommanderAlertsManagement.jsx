import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../../services/axios';
import AddAlertIcon from '../../../images/icons8-plus-sign-96.png';
import '../UnitCmd.css';
import AlertsList from './AlertsList';

export default function UnitCommanderAlertsManagement () {
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
                        <a href="#" onClick={() => navigate("/subadmin/assign-members")}>Unit Members</a>
                        <a href="#" onClick={() => navigate("/subadmin/view-messages")}>Messages</a>
                        <a href="#" onClick={() => navigate("/subadmin/alerts")}>Alerts</a>
                        <a href="#" onClick={handleLogOut}>Logout</a>
                    </nav>
                </aside>

               <main className="main-content">
                    <div className="header-container">
                        <h1 className="headings">Manage Alerts</h1>
                        <div className="search-container">
                            <input type="text" placeholder="Search..."  
                                
                            />
                            <button>Search</button>
                        </div>
                    </div>

                    <div className="add-user-container">
                        <button className="add-user-btn" >
                           <img src={AddAlertIcon} /> { 'Add New Alert'}
                        </button>
                    </div>


                </main>
            </div>
        </div>
    )
}                    