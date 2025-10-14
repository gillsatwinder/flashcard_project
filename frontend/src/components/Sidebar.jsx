import "../styles/Sidebar.css";

function Sidebar() {
    return (
        <div className="sidebar">
            <h2>Flashcard App</h2>
            <nav>
                <ul>
                    <li>All Courses</li>
                    <li>My Favorites</li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;