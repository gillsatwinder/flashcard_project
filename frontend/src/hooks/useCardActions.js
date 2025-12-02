import { useCallback } from "react";
import API_URL from "../config";

const useCardActions = () => {

    const getCards = useCallback(async (deckId) => {
        const response = await fetch(`${API_URL}/api/cards/getAll/${deckId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();
        if (!response.ok) {
             if (response.status === 404 || response.status === 400) {
                 return [];
             }
             throw new Error(data.error || "Error loading cards");
        }
        return data;
    }, []);

    const addCard = useCallback(async (cardData) => {
        const response = await fetch(`${API_URL}/api/cards/`, {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify(cardData)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Error creating card");
        }
        return data;
    }, []);

    const updateCard = useCallback(async (cardId, cardData) => {
        const response = await fetch(`${API_URL}/api/cards/${cardId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cardData)
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Error updating card");
        }
        return data;
    }, []);

    const deleteCard = useCallback(async (cardId) => {
        const response = await fetch(`${API_URL}/api/cards/${cardId}`, {
            method: "DELETE",
        });

        const data = await response.json();
        if (!response.ok) {
             throw new Error(data.error || data.message || "Error deleting card");
        }
        return data;
    }, []);

    const generateCardsFromPDF = useCallback(async (formData) => {
        const response = await fetch(`${API_URL}/api/cards/generate`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || "Error generating cards");
        }
        return data;
    }, []);

    return {
        getCards,
        addCard,
        updateCard,
        deleteCard,
        generateCardsFromPDF
    };
};

export default useCardActions;