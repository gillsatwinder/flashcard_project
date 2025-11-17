import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
    const location = useLocation();

    return (
        <aside className="sidebar">
            <h2 className="sidebar-title">📚 Flashcard App</h2>
            <nav>
                <ul className="sidebar-list">
                    <li
                        className={`sidebar-item ${location.pathname === "/dashboard" ? "active" : ""
                            }`}
                    >
                        <Link to="/dashboard">All Decks</Link>
                    </li>
                    <li
                        className={`sidebar-item ${location.pathname === "/dashboard/favorites" ? "active" : ""
                            }`}
                    >
                        <Link to="/dashboard/favorites">My Favorites</Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
