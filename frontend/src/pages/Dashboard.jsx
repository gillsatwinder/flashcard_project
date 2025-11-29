import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";
import Footer from "../components/Footer";

function Dashboard({ currentUser }) {
    const navigate = useNavigate();

    return (
        <div className="page">
            <div className="page-content">
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
                            <Outlet context={{ currentUser }} />
                        </main>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Dashboard;
