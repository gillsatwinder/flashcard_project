const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
    deckID: {type: Number, required: true, unique: true},
    userEmail: {type: String, required: true} ,
    title: {type: String, required: true},
    isFavorite: {type: Boolean, default: false}
});

module.exports = mongoose.model('Deck', deckSchema);