/*
Author: Bo Wang
Last Updated: 10/21/25
Description: DeckPage component to display cards within a deck and allow adding and managing cards.
*/
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import useItemManager from "../hooks/useItemManager";
import AddItemForm from "../components/AddItemForm";


// Component for editable card
function EditableCard({ card, onDelete, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({ front: card.front, back: card.back });

    const handleChange = (field, value) => {
        setEditValues({ ...editValues, [field]: value });
    };

    const handleSave = () => {
        onSave(editValues);
        setIsEditing(false);
    };

    return (
        <div className="card">
            {isEditing ? (
                <>
                    <input
                        type="text"
                        value={editValues.front}
                        onChange={(e) => handleChange("front", e.target.value)}
                        placeholder="Front side"
                    />
                    <input
                        type="text"
                        value={editValues.back}
                        onChange={(e) => handleChange("back", e.target.value)}
                        placeholder="Back side"
                    />
           
                    <button onClick={handleSave}>Done</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </>
            ) : (
                <>
                    <h3>Q: {card.front}</h3>
                    <p>A: {card.back}</p>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                    <button onClick={onDelete}>Delete</button>
                </>
            )}
        </div>
    );
}

function DeckPage() {
    // get courseId and deckId from URL params
    const { courseId, deckId } = useParams();

    // use custom hook to manage cards
    const { items: cards, addItem: addCard, deleteItem: deleteCard, updateItem: editCard } =
        useItemManager([
            { id: 1, front: "What is React?", back: "A JavaScript library for UI." },
            { id: 2, front: "What is JSX?", back: "A syntax extension for JavaScript." },
        ]);
    
    // state for showing add card form and form values
    const [showForm, setShowForm] = useState(false);
    // form values for new card
    const [formValues, setFormValues] = useState({ front: "", back: "" });

    // handle form input changes
    const handleChange = (field, value) => {
        setFormValues({ ...formValues, [field]: value });
    };
    // handle adding a new card
    const handleAdd = () => {
        addCard({ front: formValues.front, back: formValues.back });
        setFormValues({ front: "", back: "" });
        setShowForm(false);
    };
    // render the deck page
    return (
        <div className="deck-page">
            {/* link back to course page */}
            <Link to={`/dashboard/course/${courseId}`} className="back-button">
                ← Back to Course
            </Link>
            <h1>Deck ID: {deckId}</h1>
            <button onClick={() => setShowForm(true)}>+ Add Card</button>

            {/* Show add card form if showForm is true */}
            {showForm && (
                <AddItemForm
                    fields={[
                        { name: "front", placeholder: "Card Front" },
                        { name: "back", placeholder: "Card Back" },
                    ]}
                    // Pass the form values and handlers to the form
                    values={formValues}
                    onChange={handleChange}
                    onSubmit={handleAdd}
                    onCancel={() => setShowForm(false)}
                    mode="add"
                />
            )}
            {/* Show cards grid */}
            <div className="cards-grid">
                {cards.map((card) => (
                    <EditableCard
                        key={card.id}
                        card={card}
                        onDelete={() => deleteCard(card.id)}
                        onSave={(updated) => editCard(card.id, updated)}
                    />
                ))}
            </div>
        </div>
    );
}


export default DeckPage;
