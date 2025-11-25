const express = require('express');
const router = express.Router();
const cardFuncts = require('../controllers/cardFunctions');
const AICardFunctions = require('../controllers/AICardFunctions');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Files go to uploads/ fold

/*****************AI Card Routes *******************/

// POST /generate - creates new cards using chatGPT and a pdf
router.post('/generate', upload.single('pdf'), AICardFunctions.generateFlashcards);

/*****************Regular Card Routes***************/

//Post route to create a new card.
router.post('/', cardFuncts.createCard);

//Get route to get all card with a given deckID.
router.get('/:deckID', cardFuncts.getAllCards);

//GET route to get a specific card identified by cardID.
router.get('/:cardID', cardFuncts.getCard);

//PUT route to update a specific card by cardID
router.put('/:cardID', cardFuncts.updateCard);

//DELETE route to remove a specific card by cardID.
router.delete('/:cardID', cardFuncts.deleteCard);

//Delete route to remove all cards with a given deckID.
router.delete('/deck/:deckID', cardFuncts.deleteCardsByDeck);

module.exports = router;