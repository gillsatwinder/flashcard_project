/*
Latest Update: 10/25/25
Description: AllDecksView component to display and manage all decks.
*/
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import useItemManager from "../hooks/useItemManager";
import AddItemForm from "../components/AddItemForm";
import "../styles/AllDecksView.css";
import Footer from "../components/Footer";


function AllDecksView() {
    const { currentUser } = useOutletContext(); // Get the currentUser from the Outlet in App.jsx.
    const [decks, setDecks] = useState([]);
    const { addItem: addDeck, deleteItem: deleteDeck } = useItemManager([]);


    // state for showing add deck form and form values
    const [showForm, setShowForm] = useState(false); // State to control form visibility
    const [formValues, setFormValues] = useState({ name: "", description: "" });



    // Load decks from database
    useEffect(() => {
        const loadDecks = async () => {
            if (!currentUser?.email) return;

            try {
                // Note: You'll need to update the backend route to use userEmail
                const encodedEmail = encodeURIComponent(currentUser.email);
                const response = await fetch(`http://localhost:5000/api/decks/user/${encodedEmail}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    const mappedDecks = data.map(deck => ({
                        id: deck.deckID,
                        name: deck.title,
                        description: deck.description || "",
                        cardCount: deck.cardCount || 0
                    }));
                    setDecks(mappedDecks);
                }
            } catch (error) {
                console.error('Error loading decks:', error);
            }
        };

        loadDecks();
    }, [currentUser?.email, setDecks]);



    // handle form input changes
    const handleChange = (field, value) => {
        setFormValues({ ...formValues, [field]: value });
    };

    // Updated handleSubmit to save to database
    const handleSubmit = async () => {
        const trimmedName = formValues.name.trim();
        if (trimmedName === "") {
            alert("Deck name cannot be empty.");
            return;
        }

        if (!currentUser?.email) {
            alert("Please log in to create decks");
            return;
        }

        const isDuplicate = decks.some((deck) => deck.name.toLowerCase() === trimmedName.toLowerCase());
        if (isDuplicate) {
            alert("A deck with this name already exists.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/decks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: trimmedName, description: formValues.description, userEmail: currentUser.email })
            });

            const data = await response.json();

            if (response.ok) {
                setDecks(prevDecks => [...prevDecks, {
                    id: data.deck.deckID,
                    name: trimmedName,
                    description: formValues.description,
                    cardCount: 0
                }]); setFormValues({ name: "", description: "" });
                setShowForm(false);
                console.log("Deck created successfully!", data);
            } else {
                alert(data.error || 'Error creating deck');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create deck');
        }
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