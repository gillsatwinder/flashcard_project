/*
Author: Bo Wang, Gareth Noble
Last Updated: 11/4/25
Description: DeckPage component to display cards within a deck and allow adding and managing cards.
*/


import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/DeckPage.css";
import AddItemForm from "../components/AddItemForm";
import useDeckActions from "../hooks/useDeckActions";
import useCardActions from "../hooks/useCardActions";
import { getUserID } from '../get-user-info/getUserFromToken';


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


function PDFModal({ isOpen, onClose, onSubmit }) {
    const [pdfFile, setPdfFile] = useState(null);
    const [numFlashcards, setNumFlashcards] = useState(10);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pdfFile) {
            onSubmit(pdfFile, numFlashcards);
            setPdfFile(null);
            setNumFlashcards(10);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Generate Cards from PDF</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="pdf-upload">Select PDF File:</label>
                        <input
                            type="file"
                            id="pdf-upload"
                            accept=".pdf"
                            onChange={(e) => setPdfFile(e.target.files[0])}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="num-cards">Number of Flashcards:</label>
                        <input
                            type="number"
                            id="num-cards"
                            min="1"
                            max="50"
                            value={numFlashcards}
                            onChange={(e) => setNumFlashcards(parseInt(e.target.value))}
                            required
                        />
                    </div>

                    <div className="modal-buttons">
                        <button type="submit" className="btn btn-primary">
                            Generate Cards
                        </button>
                        <button type="button" onClick={onClose} className="btn btn-cancel">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function DeckPage() {
    console.log("DeckPage component is starting!");
    const { deckName } = useParams();
    const [currentDeckId, setCurrentDeckId] = useState(null);
    const [cards, setCards] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [formValues, setFormValues] = useState({ front: "", back: "" });
    const [showPDFModal, setShowPDFModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const { getDeckByTitle, toggleFavorite } = useDeckActions();
    const { getCards, addCard, updateCard, deleteCard, generateCardsFromPDF } = useCardActions();

    //  Loading states for AI card generator.
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatingMessage, setGeneratingMessage] = useState("");

    const userID = getUserID();
    console.log("UserID:", userID);
    if (!userID) {
        alert("Please log in to view this deck");
    }

    // New Effect: Lookup Deck ID from Name
    useEffect(() => {
        const fetchDeckId = async () => {
            if (!userID || !deckName) return;

            try {
                const data = await getDeckByTitle(deckName, userID);
                setCurrentDeckId(data.deckID);
                setIsFavorite(data.isFavorite || false);
            } catch (error) {
                console.error("Error fetching deck ID:", error);
            }
        };

        fetchDeckId();
    }, [deckName, userID, getDeckByTitle]);

    // Existing Effect: Load Cards (Dependent on currentDeckId)
    useEffect(() => {
        const loadCards = async () => {
            if (!userID || !currentDeckId) return;

            try {
                const data = await getCards(currentDeckId);
                const mappedCards = data.map(card => ({
                    id: card.cardID,
                    front: card.qSide,
                    back: card.aSide
                }));
                console.log("✅ Setting cards:", mappedCards);
                setCards(mappedCards);

            } catch (error) {
                console.error("Error loading cards:", error);
                setCards([]);
            }
        };

        loadCards();
    }, [currentDeckId, userID, getCards]);


    const handleAdd = async () => {
        try {
            const requestBody = {
                qSide: formValues.front,
                aSide: formValues.back,
                deckID: currentDeckId
            }; const data = await addCard(requestBody);

            const newCard = {
                id: data.card.cardID,
                front: formValues.front,
                back: formValues.back
            };
            setCards(prevCards => [...prevCards, newCard]);
            setFormValues({ front: "", back: "" });
            setShowForm(false);

        } catch (error) {
            console.error("Error:", error);
            alert("Failed to create card");
        }
    };


    const handleEdit = async (cardId, updatedValues) => {
        try {
            const data = await updateCard(cardId, { qside: updatedValues.front, aside: updatedValues.back });

            setCards(prevCards =>
                prevCards.map(card =>
                    card.id === cardId
                        ? { ...card, front: updatedValues.front, back: updatedValues.back }
                        : card
                )
            );

            console.log("Card edited successfully!: ", data);
        }
        catch (error) {
            console.error("Error:", error);
            alert("Failed to update card");
        }
    }

    const handlePDFSubmit = async (pdfFile, numFlashcards) => {
        if (!currentDeckId) return;

        const formData = new FormData();
        formData.append("pdf", pdfFile);
        formData.append("numFlashcards", numFlashcards);
        formData.append("deckID", currentDeckId);


        const userID = getUserID();
        formData.append("userID", userID);

        setIsGenerating(true);
        setGeneratingMessage("Generating Cards...");


        try {
            const data = await generateCardsFromPDF(formData);

            setGeneratingMessage("Cards generated! Reloading...");

            // Reload cards after generation
            try {
                const cardsData = await getCards(currentDeckId);
                const mappedCards = cardsData.map(card => ({
                    id: card.cardID,
                    front: card.qSide,
                    back: card.aSide
                }));

                console.log("✅ Setting cards:", mappedCards);
                setCards(mappedCards);
                setGeneratingMessage("Cards loaded successfully!");
            }
            catch (error) {
                console.error("Error reloading cards: ", error);
                setGeneratingMessage("Error loading new cards");
            }

            alert(`Successfully generated ${data.flashcards.length} flashcards!`);

        }
        catch (error) {
            console.error("Error generating flashcards:", error);
            setGeneratingMessage("Error generating cards");
            alert("Failed to generate flashcards. Please try again.");
        }
        finally {
            setTimeout(() => {
                setIsGenerating(false);
                setGeneratingMessage("");
            }, 2000);
        }
    };


    const handleToggleFavorite = async () => {
        if (!currentDeckId) return;

        const currentFavorite = isFavorite;
        // Optimistic update
        setIsFavorite(!isFavorite);

        try {
            const fav = await toggleFavorite(currentDeckId);
            console.log("Favorite toggled successfully:", fav);
        } catch (error) {
            console.error("Network error toggling favorite:", error);
            alert(`Error: ${error.message}`);
            // Revert on error
            setIsFavorite(currentFavorite);
        }
    }


    const handleDeleteCard = async (cardId) => {
        if (!window.confirm("Are you sure you want to delete this card?")) {
            return;
        }

        // Optimistic delete
        setCards(prevCards => prevCards.filter(card => card.id !== cardId));

        try {
            const data = await deleteCard(cardId);
            console.log("Card deleted successfully:", data.message);

        } catch (error) {
            console.error("Network error deleting card:", error);
            alert(`Error: ${error.message}`);
            // Reload cards on error
            window.location.reload();
        }
    };

    return (
        <div className="deck-page">
            <Link to="/dashboard" className="back-button">← Back to All Decks</Link>

            <h1>{deckName}</h1>
            <button onClick={() => setShowForm(true)}>+ Add Card</button>

            <button
                onClick={() => setShowPDFModal(true)}
                className="btn-pdf"
            >
                + Generate Cards From PDF (AI Powered)
            </button>

            <button
                onClick={handleToggleFavorite}
                className={isFavorite ? "btn-favorite-active" : "btn-favorite"}
            >
                {isFavorite ? "★ Favorited" : "☆ Favorite"}
            </button>


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

            {/* Generating Message For AI Cards. */}
            {isGenerating && (
                <div className="generating-message">
                    {generatingMessage}
                </div>
            )}


            <PDFModal
                isOpen={showPDFModal}
                onClose={() => setShowPDFModal(false)}
                onSubmit={handlePDFSubmit}
            />

            <div className="cards-grid">
                {cards.map((card) => (
                    <EditableCard
                        key={card.id}
                        card={card}
                        onDelete={() => handleDeleteCard(card.id)}
                        onSave={(updated) => handleEdit(card.id, updated)}
                    />
                ))}
            </div>
        </div>
    );
}

export default DeckPage;
