const express = require('express');
const router = express.Router();
const deckFuncts = require('../controllers/deckFunctions');

//POST route to create a new deck.
router.post('/', deckFuncts.createDeck);

//GET route to retrieve a deck by deckID
router.get('/:deckID', deckFuncts.getDeck);

//GET route to retrieve all decks belonging for a user.
router.get('/user/:userID', deckFuncts.getAllDecks);

//PUT route to update a deck by deckID
router.put('/:deckID', deckFuncts.updateDeck);

//Delete route to remove a deck by deckID
router.delete('/:deckID', deckFuncts.deleteDeck);

//Delete route to remove all decks for a given user.
router.delete('/user/:userID', deckFuncts.deleteAllDecks);

module.exports = router;