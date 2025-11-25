import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

function Dashboard({ currentUser }) {
    const navigate = useNavigate();

    return (
        <div className="dashboard-layout">
            {/* Top bar */}
            <header className="top-bar">
                <div className="logo-text">Flashcard Dashboard</div>
                <div className="user-controls">
                    <div className="profile-icon">👤</div>
                    <button className="logout-btn" onClick={() => navigate("/")}>
                        Logout
                    </button>
                </div>
            </header>

            {/* Main content */}
            <div className="content-wrapper">
                <Sidebar />
                <main className="main-content">
                    <Outlet context={{currentUser}}/>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
