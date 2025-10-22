const express = require('express');
const router = express.Router();
const cardFuncts = require('../../database/DBFunctions/cardFunctions');

// POST /users — create new user
router.post('/', cardFuncts.createCard);

// PUT /users/:id — update existing user
router.put('/:id', cardFuncts.updateCard);

router.post('/:id_2', cardFuncts.deleteCard);

module.exports = router;