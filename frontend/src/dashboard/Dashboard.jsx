import React from "react";
import "./Dashboard.css";
import { Navigate, useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
  return (
    <div className="dashboard">
      {/* Top Taskbar */}
      <header className="top-bar">
        <div className="profile-icon">👤</div>
        <button className="logout-btn" onClick={()=> navigate("/")}>Logout</button>
      </header>

      {/* Layout with Sidebar + Main */}
      <div className="content-layout">
        {/* Sidebar */}
        <nav className="sidebar">
          <button className="menu-item">Home</button>
          <button className="menu-item">Create</button>
          <button className="menu-item">Library</button>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <h2>Welcome to Your Dashboard</h2>
          <p>Select an option from the menu to begin.</p>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
