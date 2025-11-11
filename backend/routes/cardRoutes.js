const express = require('express');
const router = express.Router();
const cardFuncts = require('../controllers/cardFunctions');
const AICardFunctions = require('../controllers/AICardFunctions');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Files go to uploads/ fold

// POST /cards — create new card
router.post('/', cardFuncts.createCard);

// POST /generate - creates new cards using chatGPT and a pdf
router.post('/generate', upload.single('pdf'), AICardFunctions.generateFlashcards);

// GET /cards — get all cards (can filter by deckID with query param)
router.get('/', cardFuncts.getAllCards);

// GET /cards/:id — get specific card
router.get('/:id', cardFuncts.getCard);

// PUT /cards/:id — update existing card
router.put('/:id', cardFuncts.updateCard);

// DELETE /cards/:id — delete specific card
router.delete('/:id', cardFuncts.deleteCard);

// DELETE /cards/deck/:deckID — delete all cards in a deck
router.delete('/deck/:deckID', cardFuncts.deleteCardsByDeck);

module.exports = router;