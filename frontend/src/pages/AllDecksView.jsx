/*
Latest Update: 10/25/25
Description: AllDecksView component to display and manage all decks.
*/
import { Link } from "react-router-dom";
import { useState } from "react";
import useItemManager from "../hooks/useItemManager";
import AddItemForm from "../components/AddItemForm";
import "../styles/AllDecksView.css";


function AllDecksView() {
    // hardcoded sample data for courses
    const { items: decks, addItem: addDeck, deleteItem: deleteDeck } =
        useItemManager([
            { id: 1, name: "CS372", description: "Intro to Web Development", cardCount: 5 },
        ]);

    // state for showing add deck form and form values
    const [showForm, setShowForm] = useState(false); // State to control form visibility
    const [formValues, setFormValues] = useState({ name: "", description: "" });

    // handle form input changes
    const handleChange = (field, value) => {
        setFormValues({ ...formValues, [field]: value });
    };

    // handle adding a new deck
    const handleSubmit = () => {
        const trimmedName = formValues.name.trim();
        if (trimmedName === "") {
            alert("Deck name cannot be empty.");
            return;
        }
        const isDuplicate = decks.some((deck) => deck.name.toLowerCase() === trimmedName.toLowerCase());
        if (isDuplicate) {
            alert("A deck with this name already exists.");
            return;
        }
        // add the new deck
        addDeck({
            name: trimmedName,
            description: formValues.description,
            cardCount: 0,
        });

        // reset form values and hide form
        setFormValues({ name: "", description: "" });
        setShowForm(false);
    };

    // render the all decks view
    return (
         <div className="all-decks-container">
            <div className="header-section">
                <h1 className="page-title">My Decks</h1>
                <button className="add-deck-btn" onClick={() => setShowForm(true)}>
                    + New Deck
                </button>
            </div>

            {showForm && (
                <div className="deck-form-section">
                    <AddItemForm
                        fields={[
                            { name: "name", placeholder: "Deck Name" },
                            { name: "description", placeholder: "Description" },
                        ]}
                        values={formValues}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            <div className="deck-grid">
                {decks.length === 0 ? (
                    <p className="empty-text">No decks yet. Start by creating one!</p>
                ) : (
                    decks.map((deck) => (
                        <div key={deck.id} className="deck-card">
                            <div className="deck-card-header">
                                <h3>{deck.name}</h3>
                            </div>
                            <div className="deck-card-body">
                                <p>{deck.description}</p>
                                <p className="deck-count">Cards: {deck.cardCount}</p>
                            </div>
                            <div className="deck-card-footer">
                                <Link to={`/dashboard/deck/${deck.id}`} className="view-btn">
                                    Open
                                </Link>
                                <button
                                    className="delete-btn"
                                    onClick={() => deleteDeck(deck.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default AllDecksView;
