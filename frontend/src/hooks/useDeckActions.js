import { useCallback } from "react";
import API_URL from "../config";

const useDeckActions = () => {

    const createDeck = useCallback(async (title, userID) => {
        const response = await fetch(`${API_URL}/api/decks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, userID })
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

    const getDeckByTitle = useCallback(async (title, userID) => {
        const encodedTitle = encodeURIComponent(title);
        if (!userID) {
            throw new Error('User ID is required');
        }


        const response = await fetch(`${API_URL}/api/decks/lookup?title=${encodedTitle}&userID=${userID}`);

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Deck not found');
        }
        return data;
    }, []);

    const getUserDecks = useCallback(async (userID) => {

        if (!userID) {
            throw new Error('User ID is required');
        }

        const response = await fetch(`${API_URL}/api/decks/user/${userID}`, {
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
