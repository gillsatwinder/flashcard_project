/*
Author: Bo Wang, Gareth Noble
Last Updated: 11/4/25
Description: DeckPage component to display cards within a deck and allow adding and managing cards.
*/


import { useParams, Link, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
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
    const { currentUser } = useOutletContext();
    const { deckId } = useParams();
    const [cards, setCards] = useState([]);
    const { addItem: addCard, deleteItem: deleteCard, updateItem: editCard } = useItemManager([]);

    const [showForm, setShowForm] = useState(false);
    const [formValues, setFormValues] = useState({ front: "", back: "" });
    const [showPDFModal, setShowPDFModal] = useState(false);



    useEffect(() => {
        const loadCards = async () => {
            if (!currentUser?.email) return;

            try {
                const response = await fetch(`http://localhost:5000/api/cards/${deckId}?userEmail=${encodeURIComponent(currentUser.email)}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                console.log("📡 Response status:", response.status);


                if (response.ok) {
                    const data = await response.json();
                    const mappedCards = data.map(card => ({
                        id: card.cardID,
                        front: card.qSide,
                        back: card.aSide
                    }));

                    console.log("✅ Setting cards:", mappedCards);
                    setCards(mappedCards);
                } else if (response.status === 404 || response.status === 400) { setCards([]); }


            } catch (error) {
                console.log("❌ Backend error message:", data.message);
                console.error('Error loading cards:', error);
            }
        };

        loadCards();
    }, [deckId, currentUser?.email]);





    const handleAdd = async () => {
        console.log("Current user:", currentUser); // Add this debug line
        console.log("User email:", currentUser?.email); // Add this debug line

        if (!currentUser?.email) {
            alert("Please log in to add cards");
            return;
        }

        try {
            const requestBody = { qSide: formValues.front, aSide: formValues.back, userEmail: currentUser?.email, deckID: deckId };
            console.log("Request body:", requestBody); // Add this line

            const response = await fetch('http://localhost:5000/api/cards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ qSide: formValues.front, aSide: formValues.back, userEmail: currentUser?.email, deckID: deckId })
            });

            console.log("Response status:", response.status); // Add this line
            console.log("Response headers:", response.headers); // Add this line


            const data = await response.json();

            console.log("Response data:", data); // Add this line


            if (response.ok) {
                const newCard = {
                    id: data.card.cardID,
                    front: formValues.front,
                    back: formValues.back
                };
                console.log("🆕 Adding new card to state:", newCard);
                setCards(prevCards => {
                    console.log("📦 Previous cards:", prevCards);
                    const updated = [...prevCards, newCard];
                    console.log("📦 Updated cards:", updated);
                    return updated;
                });
                setFormValues({ front: "", back: "" });
                setShowForm(false);
            } else { alert(data.message || 'Error creating card'); }


        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create card');
        }
    };


    const handleEdit = async (cardId, updatedValues) => {
        try {
            const response = await fetch(`http://localhost:5000/api/cards/${cardId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qside: updatedValues.front, aside: updatedValues.back })
            });

            const data = await response.json();

            if (response.ok) {
                setCards(prevCards =>
                    prevCards.map(card =>
                        card.id === cardId
                            ? { ...card, front: updatedValues.front, back: updatedValues.back }
                            : card
                    )
                );

                console.log("Card edited successfully!: ", data)
            }
            else { alert(data.message || 'Error with updating the card.') }
        }
        catch (error) {
            console.error('Error:', error);
            alert('Failed to update card');
        }
    }







    const handlePDFSubmit = async (pdfFile, numFlashcards) => {
        const formData = new FormData();

        formData.append('pdf', pdfFile); formData.append('numFlashcards', numFlashcards);
        formData.append('deckID', deckId); formData.append('userEmail', currentUser?.email);


        try {
            const response = await fetch(`http://localhost:5000/api/cards/generate`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {

                data.flashcards.forEach((card, index) => {
                    console.log(`Adding card ${index + 1}:`, card);
                    const newCard = {
                        front: card.question,
                        back: card.answer
                    };
                    console.log('Formatted card:', newCard);
                    addCard(newCard);
                });

                alert(`Successfully generated ${data.flashcards.length} flashcards!`);

            }

            else {
                alert(`Error: ${data.error}`);
            }


        } catch (error) {
            console.error('Error generating flashcards:', error);
            alert('Failed to generate flashcards. Please try again.');
        }
    };



    return (
        <div className="deck-page">
            <Link to="/dashboard" className="back-button">← Back to All Decks</Link>

            <h1>Deck ID: {deckId}</h1>
            <button onClick={() => setShowForm(true)}>+ Add Card</button>

            <button
                onClick={() => setShowPDFModal(true)}
                style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    marginLeft: '10px'
                }}
            >
                + Generate Cards From PDF
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
                        onDelete={() => deleteCard(card.id)}
                        onSave={(updated) => handleEdit(card.id, updated)}
                    />
                ))}
            </div>
        </div>
    );
}

export default DeckPage;
