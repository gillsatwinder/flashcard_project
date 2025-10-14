/*
Latest Update: 10/12/25
Description: AllCoursesView component to display and manage all courses.
*/
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";
import { useState } from "react";

function AllCoursesView() {
    // hardcoded sample data for courses
    const [courses, setCourses] = useState([
        {id: 1, name: "CS372", description: "Introduction to Web Development", deckCount: 5},
    ]);
    const [showForm, setShowForm] = useState(false); // State to control form visibility
    const [newCourseName, setNewCourseName] = useState("");
    const [newCourseDescription, setNewCourseDescription] = useState("");

    // Function to create a new course
    function createCourse() {
        // Create new course object
        const newCourse = {
            id: courses.length + 1,
            name: newCourseName,
            description: newCourseDescription,
            deckCount: 0
        };
        // Course name validation
        if (newCourseName.trim() === "") {
            alert("Please enter a course name.");
            return;
        } else if (courses.some(course => course.name.toLowerCase() === newCourseName.toLowerCase())) {
            alert("Course with this name already exists.");
            return;
        }
        // Add new course to the list
        setCourses([...courses, newCourse]);

        // Clear form fields to default state
        setNewCourseName("");
        setNewCourseDescription("");

        // Hide form
        setShowForm(false);
    }

    // Function to delete a course
    const deleteCourse = (courseId) => {
        // Remove course from the list based on its ID
        const newCourseList = courses.filter(course => course.id !== courseId);
        setCourses(newCourseList);
    };


    return (
        <div>
            <h1>All Courses</h1>
            {/* Button to show the add course form */}
            <button onClick={() => setShowForm(true)} className="add-course-button"> + Add New Course</button>
            {showForm && (
                <div>
                    <div className="course-form">
                        <input type="text"
                            placeholder="Course Name"
                            value={newCourseName}
                            onChange={(e) => setNewCourseName(e.target.value)}
                        />
                        <textarea
                            placeholder="Course Description"
                            value={newCourseDescription}
                            onChange={(e) => setNewCourseDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <button onClick={createCourse}>Add Course</button>
                    <button onClick={() => setShowForm(false)}>Cancel</button>  {/* Hide form on cancel */}
                </div>
            )}
            {/* Courses grid */}
            <div className="courses-grid">
                {/* Render each course as a card */}
                {courses.map((course) => (
                    <div key={course.id} className="course-card">
                        <Link to={`/dashboard/course/${course.id}`} className="course-link">
                            <h3>{course.name}</h3>
                            <p>{course.description}</p>
                            <p>Decks: {course.deckCount}</p>
                        </Link>
                        <button onClick={(e) => {
                            e.stopPropagation();
                            deleteCourse(course.id);
                        }} className="delete-button">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllCoursesView;