import { Outlet, useNavigate } from "react-router-dom"; // Import Outlet to render nested routes
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";


function Dashboard() {
    
    const navigate = useNavigate();

    return (
        <div className="dashboard">

            {/* Top Taskbar */}
            <header className="top-bar">
                <div className="profile-icon">👤</div>
                <button className="logout-btn" onClick={() => navigate("/")}>Logout</button>
            </header>

            {/* Main content area */}
            <div className="content-area">
                {/* Sidebar component */}
                <Sidebar />
                
                {/* Course, Deck, Cards etc. */}
                <main className="main-area">
                    <Outlet /> {/* Render nested routes */}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;