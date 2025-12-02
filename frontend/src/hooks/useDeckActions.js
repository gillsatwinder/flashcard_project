import { useCallback } from "react";
import API_URL from "../config";

const useDeckActions = () => {

    const createDeck = useCallback(async (title, userEmail) => {
        const response = await fetch(`${API_URL}/api/decks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, userEmail })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Error creating deck');
        }
        return data;
    }, []);

    const toggleFavorite = useCallback(async (deckId) => {
        const response = await fetch(`${API_URL}/api/decks/${deckId}/favorite`, {
            method: 'PUT',
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Error toggling favorite');
        }
        return data;
    }, []);

    const deleteDeck = useCallback(async (deckId) => {
        const response = await fetch(`${API_URL}/api/decks/${deckId}`, {
            method: 'DELETE',
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Error deleting deck');
        }
        return data;
    }, []);

    const getDeckByTitle = useCallback(async (title, userEmail) => {
        const encodedTitle = encodeURIComponent(title);
        const encodedEmail = encodeURIComponent(userEmail);
        const response = await fetch(`${API_URL}/api/decks/lookup?title=${encodedTitle}&userEmail=${encodedEmail}`);

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Deck not found');
        }
        return data;
    }, []);

    const getUserDecks = useCallback(async (userEmail) => {
        const encodedEmail = encodeURIComponent(userEmail);
        const response = await fetch(`${API_URL}/api/decks/user/${encodedEmail}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Error fetching decks');
        }
        return data;
    }, []);

    return {
        createDeck,
        toggleFavorite,
        deleteDeck,
        getDeckByTitle,
        getUserDecks
    };
};

export default useDeckActions;
