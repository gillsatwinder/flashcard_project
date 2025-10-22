/*
Description: Dashboard page component with sidebar and main content area
Author: Bo Wang
Date: 10/12/25
*/
import { Outlet } from "react-router-dom"; // Import Outlet to render nested routes
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";


function Dashboard() {


    return (
        <div className="dashboard">
            {/* Sidebar component */}
            <Sidebar />

            {/* Main content area */}
            <div className="main-content">
                <Outlet /> {/* Render nested routes */}
            </div>
        </div>
    );
}

export default Dashboard;