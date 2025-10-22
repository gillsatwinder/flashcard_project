/*
Latest Update: 10/21/25
Description: AllCoursesView component to display and manage all courses.
*/
import { Link } from "react-router-dom";
import { useState } from "react";
import useItemManager from "../hooks/useItemManager";
import AddItemForm from "../components/AddItemForm";


function AllCoursesView() {
    // hardcoded sample data for courses
    const { items: courses, addItem: addCourse, deleteItem: deleteCourse } =
        useItemManager([
            { id: 1, name: "CS372", description: "Intro to Web Development", deckCount: 5 },
        ]);

    // state for showing add course form and form values
    const [showForm, setShowForm] = useState(false); // State to control form visibility
    const [formValues, setFormValues] = useState({ name: "", description: "" });

    // handle form input changes
    const handleChange = (field, value) => {
        setFormValues({ ...formValues, [field]: value });
    };

    // handle adding a new course
    const handleSubmit = () => {
        addCourse({
            name: formValues.name,
            description: formValues.description,
            deckCount: 0,
        });
        // reset form values and hide form
        setFormValues({ name: "", description: "" });
        setShowForm(false);
    };

    // render the all courses view
    return (
        <div className="all-courses-view">
            <h1>All Courses</h1>
            {/* Button to show the add course form */}
            <button onClick={() => setShowForm(true)} className="add-course-button"> + Add New Course</button>
            {/* Show add course form if showForm is true */}
            {showForm && (
                <AddItemForm
                    fields={[
                        { name: "name", placeholder: "Course Name" },
                        { name: "description", placeholder: "Description" },
                    ]}
                    values={formValues}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowForm(false)}
                />
            )}
            {/* Courses grid */}
            <div className="courses-grid">
                {/* Display each course as a card */}
                {courses.map((course) => (
                    <div key={course.id} className="course-card">
                        <Link to={`/dashboard/course/${course.id}`}>
                            <h3>{course.name}</h3>
                            <p>{course.description}</p>
                            <p>Decks: {course.deckCount}</p>
                        </Link>
                        <button onClick={() => deleteCourse(course.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AllCoursesView;