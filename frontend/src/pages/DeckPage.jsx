/*
Author: Bo Wang, Gareth Noble
Last Updated: 11/4/25
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
    const { deckId } = useParams();
    const { items: cards, addItem: addCard, deleteItem: deleteCard, updateItem: editCard } = useItemManager([
        { id: 1, front: "What is React?", back: "A JavaScript library for building UIs." },
    ]);

    const [showForm, setShowForm] = useState(false);
    const [formValues, setFormValues] = useState({ front: "", back: "" });
    const [showPDFModal, setShowPDFModal] = useState(false);

    const handleAdd = () => {
        addCard({ front: formValues.front, back: formValues.back });
        setFormValues({ front: "", back: "" });
        setShowForm(false);
    };


    const handlePDFSubmit = async (pdfFile, numFlashcards) => {
        const formData = new FormData();
        formData.append('pdf', pdfFile);
        formData.append('numFlashcards', numFlashcards);

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
                        onSave={(updated) => editCard(card.id, updated)}
                    />
                ))}
            </div>
        </div>
    );
}

export default DeckPage;
