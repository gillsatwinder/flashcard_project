/*
Author: Bo Wang
Last Updated: 10/24/25
Description: DeckPage component to display cards within a deck and allow adding and managing cards.
*/


import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import "../styles/DeckPage.css";
import useItemManager from "../hooks/useItemManager";
import AddItemForm from "../components/AddItemForm";

function EditableCard({ card, onDelete, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({ front: card.front, back: card.back });

    const handleChange = (field, value) => setEditValues({ ...editValues, [field]: value });

    return (
        <div className="card-container">
            <div className="card-content">
                {isEditing ? (
                    <>
                        <textarea
                            value={editValues.front}
                            onChange={(e) => handleChange("front", e.target.value)}
                            placeholder="Front side"
                            className="card-textarea"
                        />
                        <textarea
                            value={editValues.back}
                            onChange={(e) => handleChange("back", e.target.value)}
                            placeholder="Back side"
                            className="card-textarea"
                        />
                    </>
                ) : (
                    <>
                        <h3 className="card-question">Q: {card.front}</h3>
                        <p className="card-answer">A: {card.back}</p>
                    </>
                )}
            </div>

            <div className="card-buttons">
                {isEditing ? (
                    <>
                        <button
                            onClick={() => {
                                onSave(editValues);
                                setIsEditing(false);
                            }}
                            className="btn btn-save"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="btn btn-cancel"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn btn-edit"
                        >
                            Edit
                        </button>
                        <button
                            onClick={onDelete}
                            className="btn btn-delete"
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function DeckPage() {
    const { deckId } = useParams();
    const { items: cards, addItem: addCard, deleteItem: deleteCard, updateItem: editCard } = useItemManager([
        { id: 1, front: "What is React?", back: "A JavaScript library for building UIs." },
    ]);

    const [showForm, setShowForm] = useState(false);
    const [formValues, setFormValues] = useState({ front: "", back: "" });

    const handleAdd = () => {
        addCard({ front: formValues.front, back: formValues.back });
        setFormValues({ front: "", back: "" });
        setShowForm(false);
    };

    return (
        <div className="deck-page">
            <Link to="/dashboard" className="back-button">← Back to All Decks</Link>

            <h1>Deck ID: {deckId}</h1>
            <button onClick={() => setShowForm(true)}>+ Add Card</button>

            {showForm && (
                <AddItemForm
                    fields={[
                        { name: "front", placeholder: "Card Front" },
                        { name: "back", placeholder: "Card Back" },
                    ]}
                    values={formValues}
                    onChange={(field, value) => setFormValues({ ...formValues, [field]: value })}
                    onSubmit={handleAdd}
                    onCancel={() => setShowForm(false)}
                />
            )}

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
