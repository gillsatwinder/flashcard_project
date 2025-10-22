/*
Author: Bo Wang
Last Updated: 10/21/25
Description: CoursePage component to display decks within a course and allow adding and managing decks.
*/

import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import useItemManager from "../hooks/useItemManager";
import AddItemForm from "../components/AddItemForm";



// Component for editable deck
function EditableDeck({ deck, courseId, onDelete, onSave }) {

    // state for editing mode and form values
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({
        name: deck.name,
        description: deck.description,
    });

    // handle input changes
    const handleChange = (field, value) => {
        setEditValues({ ...editValues, [field]: value });
    };

    // handle save action
    const handleSave = () => {
        onSave(editValues);
        setIsEditing(false);
    };

    return (
        <div className="deck-card">
            {/* if in editing mode, show input fields; otherwise, show deck details */}
            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={editValues.name}
                        onChange={(e) => handleChange("name", e.target.value)} // handle input changes
                        placeholder="Deck name"
                    />
                    <br />
                    <input
                        type="text"
                        value={editValues.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        placeholder="Description"
                    />

                    <br />
                    <button onClick={handleSave}>Done</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </>
            ) : (
                <>
                    {/* display deck details */}
                    <Link to={`/dashboard/course/${courseId}/deck/${deck.id}`}>
                        <h3>{deck.name}</h3>
                    </Link>
                    <p>{deck.description}</p>
                    <p>Cards: {deck.cardCount}</p>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                    <button onClick={onDelete}>Delete</button>
                </>
            )}
        </div>
    );
}


function CoursePage() {
    // Get courseId from URL parameters
    const { courseId } = useParams();

    // Manage decks using useItemManager hook
    const { items: decks, addItem: addDeck, deleteItem: deleteDeck, updateItem: editDeck } =
        useItemManager([
            { id: 1, name: "HTML", description: "Learn HTML basics", cardCount: 12 },
            { id: 2, name: "CSS", description: "Learn how to style web pages", cardCount: 8 },
        ]);

    // state for showing add deck form and form values
    const [showForm, setShowForm] = useState(false);
    const [formValues, setFormValues] = useState({ name: "", description: "" });

    // handle form input changes
    const handleChange = (field, value) => {
        setFormValues({ ...formValues, [field]: value });
    };

    // handle adding a new deck
    const handleAdd = () => {
        addDeck({ name: formValues.name, description: formValues.description, cardCount: 0 });
        setFormValues({ name: "", description: "" });
        setShowForm(false);
    };

    // render the course page
    return (
        <div className="course-page">
            <Link to="/dashboard" className="back-button">
                ← Back to All Courses
            </Link>

            <h1>Course ID: {courseId}</h1>
            <button onClick={() => setShowForm(true)}>+ Add Deck</button>
            <br />
            <br />
            {/* Show add deck form if showForm is true */}
            {showForm && (
                <AddItemForm
                    fields={[
                        { name: "name", placeholder: "Deck Name" },
                        { name: "description", placeholder: "Deck Description" },
                    ]}
                    values={formValues}
                    onChange={handleChange}
                    onSubmit={handleAdd}
                    onCancel={() => setShowForm(false)}
                    mode="add"
                />
            )}

            {/* Display the list of decks */}
            <div className="decks-grid">
                {decks.map((deck) => (
                    <EditableDeck
                        key={deck.id}
                        deck={deck}
                        courseId={courseId}
                        onDelete={() => deleteDeck(deck.id)}
                        onSave={(updated) => editDeck(deck.id, updated)}
                    />
                ))}
            </div>
        </div>
    );
}

export default CoursePage;
