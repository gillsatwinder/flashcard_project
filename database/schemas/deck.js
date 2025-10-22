const mongoose = require('mongoose');

const deckSchema = new mongoose.schema({
    deckID: {type: Number, required: true, unique: true}, //Primary Key for Deck
    userID: {type: Number, required: true}, //Foreign Key tying decks to users
    title: {type: String, required: true}
});

module.exports = mongoose.model('Deck', deckSchema);