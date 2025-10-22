import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
    return (
        <div className="sidebar">
            <h2>Flashcard App</h2>
            <nav>
                <ul>
                    <li className="sidebar-item">
                        <Link to="/dashboard">All Courses</Link>
                    </li>
                    <li className="sidebar-item">
                        <Link>My Favorites</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;