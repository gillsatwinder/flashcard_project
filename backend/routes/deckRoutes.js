const express = require('express');
const router = express.Router();
const deckFuncts = require('../../database/DBFunctions/deckFunctions');

// POST /users — create new user
router.post('/', deckFuncts.createDeck);

// PUT /users/:id — update existing user
router.put('/:id', deckFuncts.updateDeck);

router.post('/:id_2', deckFuncts.deleteDeck);

module.exports = router;