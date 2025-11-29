/*
Latest Update: 10/25/25
Description: AllDecksView component to display and manage all decks.
*/
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import AddItemForm from "../components/AddItemForm";
import "../styles/AllDecksView.css";
import API_URL from "../config";


function AllDecksView() {
    const location = useLocation();
    const isFavoritesPage = location.pathname === "/dashboard/favorites";

    const { currentUser } = useOutletContext(); // Get the currentUser from the Outlet in App.jsx.
    const [decks, setDecks] = useState([]);


    // state for showing add deck form and form values
    const [showForm, setShowForm] = useState(false); // State to control form visibility
    const [formValues, setFormValues] = useState({ name: "" });



    // Load decks from database
    useEffect(() => {
        const loadDecks = async () => {
            if (!currentUser?.email) return;

            try {
                // Note: You'll need to update the backend route to use userEmail
                const encodedEmail = encodeURIComponent(currentUser.email);
                const response = await fetch(`${API_URL}/api/decks/user/${encodedEmail}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    const mappedDecks = data.map(deck => ({
                        id: deck.deckID,
                        name: deck.title,
                        // cardCount: deck.cardCount || 0, // Still not supported by backend
                        isFavorite: deck.isFavorite || false
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
            const response = await fetch(`${API_URL}/api/decks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: trimmedName, userEmail: currentUser.email })
            });

            const data = await response.json();

            if (response.ok) {
                setDecks(prevDecks => [...prevDecks, {
                    id: data.deck.deckID,
                    name: trimmedName,
                    isFavorite: false
                }]);
                setFormValues({ name: "" });
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

    // handle toggling favorite status
    const handleToggleFavorite = async (deckId) => {
        const currentDeck = decks.find(d => d.id === deckId);
        if (!currentDeck) return;

        // Optimistic update
        const newFavoriteState = !currentDeck.isFavorite;
        setDecks(prevDecks =>
            prevDecks.map(deck =>
                deck.id === deckId ? { ...deck, isFavorite: newFavoriteState } : deck
            )
        );

        try {
            const response = await fetch(`${API_URL}/api/decks/${deckId}/favorite`, {
                method: 'PUT',
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Favorite toggled successfully:', data);
            } else {
                console.error('API Error:', data.error);
                alert(`Error: ${data.error}`);
                // Revert on error
                setDecks(prevDecks =>
                    prevDecks.map(deck =>
                        deck.id === deckId ? { ...deck, isFavorite: currentDeck.isFavorite } : deck
                    )
                );
            }
        } catch (error) {
            console.error('Network error toggling favorite:', error);
            alert('Failed to connect to server.');
            // Revert on error
            setDecks(prevDecks =>
                prevDecks.map(deck =>
                    deck.id === deckId ? { ...deck, isFavorite: currentDeck.isFavorite } : deck
                )
            );
        }
    };

    // handle deleting a deck
    const handleDeleteDeck = async (deckId) => {
        if (!window.confirm('Are you sure you want to delete this deck? All cards in this deck will also be deleted.')) {
            return;
        }

        // Optimistic delete
        setDecks(prevDecks => prevDecks.filter(deck => deck.id !== deckId));

        try {
            const response = await fetch(`${API_URL}/api/decks/${deckId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Deck deleted successfully:', data.message);
            } else {
                console.error('API Error:', data.error);
                alert(`Error: ${data.error}`);
                // Note: We've already removed it optimistically, would need to reload to restore
                // For now, just reload all decks
                window.location.reload();
            }
        } catch (error) {
            console.error('Network error deleting deck:', error);
            alert('Failed to delete deck.');
            window.location.reload();
        }
    };

    // Filter decks based on current route
    const filteredDecks = isFavoritesPage
        ? decks.filter(deck => deck.isFavorite)
        : decks;

    // render the all decks view
    return (
        <div className="all-decks-container">
            <div className="header-section">
                <h1 className="page-title">{isFavoritesPage ? "My Favorites" : "My Decks"}</h1>
                {!isFavoritesPage && (
                    <button className="add-deck-btn" onClick={() => setShowForm(true)}>
                        + New Deck
                    </button>
                )}
            </div>

            {showForm && (
                <div className="deck-form-section">
                    <AddItemForm
                        fields={[
                            { name: "name", placeholder: "Deck Name" },
                        ]}
                        values={formValues}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            <div className="deck-grid">
                {filteredDecks.length === 0 ? (
                    <p className="empty-text">
                        {isFavoritesPage
                            ? "No favorite decks yet. Star some decks to see them here!"
                            : "No decks yet. Start by creating one!"}
                    </p>
                ) : (
                    filteredDecks.map((deck) => (
                        <div key={deck.id} className="deck-card">
                            <div className="deck-card-header">
                                <h3>{deck.name}</h3>
                                <button
                                    className={deck.isFavorite ? "favorite-icon-btn favorited" : "favorite-icon-btn"}
                                    onClick={() => handleToggleFavorite(deck.id)}
                                    title={deck.isFavorite ? "Remove from favorites" : "Add to favorites"}
                                >
                                    {deck.isFavorite ? "★" : "☆"}
                                </button>
                            </div>
                            <div className="deck-card-body">
                                {/* Card count not supported by backend currently */}
                            </div>
                            <div className="deck-card-footer">
                                <Link to={`/dashboard/deck/${encodeURIComponent(deck.name)}`} className="view-btn">
                                    Open
                                </Link>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDeleteDeck(deck.id)}
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