/*
Latest Update: 11/29/25
Description: AllDecksView component to display and manage all decks.
*/
import { Link, useLocation, useNavigate } from "react-router-dom"; import { useState, useEffect } from "react";
import AddItemForm from "../components/AddItemForm";
import "../styles/AllDecksView.css";
import Footer from "../components/Footer";
import useDeckActions from "../hooks/useDeckActions";
import { getUserID } from "../get-user-info/getUserFromToken";
import QuizFeature from '../quiz-feature/QuizFeature';


function AllDecksView() {
    const navigate = useNavigate();
    const location = useLocation();
    const isFavoritesPage = location.pathname === "/dashboard/favorites";

    const [decks, setDecks] = useState([]);

    const userID = getUserID();
    if (!userID) {
        alert("Please Login.")
        navigate("/signin")
    }


    const { getUserDecks, createDeck, toggleFavorite, deleteDeck } = useDeckActions();


    // state for showing add deck form and form values
    const [showForm, setShowForm] = useState(false); // State to control form visibility
    const [formValues, setFormValues] = useState({ name: "" });


    //  States for Quiz Feature.
    const [showQuiz, setShowQuiz] = useState(false);
    const [selectedDeck, setSelectedDeck] = useState(null);

    //  Handling Quiz Feature start.
    const handleStartQuiz = (deck) => {
        setSelectedDeck(deck);
        setShowQuiz(true);
    };



    // Load decks from database
    useEffect(() => {
        if (!userID) {
            console.log("No userID, redirecting to signin");
            navigate("/signin")
        }


        const loadDecks = async () => {
            try {
                const data = await getUserDecks(userID);
                const mappedDecks = data.map(deck => ({
                    id: deck.deckID,
                    name: deck.title,
                    // cardCount: deck.cardCount || 0, // Still not supported by backend
                    isFavorite: deck.isFavorite || false
                }));
                setDecks(mappedDecks);
            } catch (error) {
                console.error('Error loading decks:', error);
            }
        };

        if (userID) {
            loadDecks();
        }
    }, [userID, getUserDecks]);


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

        if (!userID) {
            alert("Please log in to create decks");
        }

        const isDuplicate = decks.some((deck) => deck.name.toLowerCase() === trimmedName.toLowerCase());
        if (isDuplicate) {
            alert("A deck with this name already exists.");
            return;
        }

        try {
            const data = await createDeck(trimmedName, userID);

            setDecks(prevDecks => [...prevDecks, {
                id: data.deckID,
                name: trimmedName,
                isFavorite: false
            }]);
            setFormValues({ name: "" });
            setShowForm(false);
            console.log("Deck created successfully!", data);
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Failed to create deck');
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
            const data = await toggleFavorite(deckId);
            console.log('Favorite toggled successfully:', data);
        } catch (error) {
            console.error('Network error toggling favorite:', error);
            alert(`Error: ${error.message}`);
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
            const data = await deleteDeck(deckId);
            console.log('Deck deleted successfully:', data.message);
        } catch (error) {
            console.error('Network error deleting deck:', error);
            alert(`Error: ${error.message}`);
            // need to reload to restore
            // For now, just reload all decks
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
                        {isFavoritesPage ? (
                            "No favorite decks yet. Star some decks to see them here!"
                        ) : (
                            <>
                                <h1>👋 Welcome to <strong>BrainFlip</strong>!</h1> <br />
                                Let's start learning — click "+ New Deck" to create your first flashcard set!
                            </>
                        )}
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
                                    className="quiz-btn"
                                    onClick={() => handleStartQuiz(deck)}
                                >
                                    Quiz!
                                </button>


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



            {showQuiz && (
                <div className="quiz-modal">
                    <div className="quiz-modal-content">
                        <button
                            className="close-quiz-btn"
                            onClick={() => setShowQuiz(false)}
                        >
                            ✕
                        </button>
                        <QuizFeature deck={selectedDeck} />
                    </div>
                </div>
            )}



        </div>
    );
}

export default AllDecksView;
