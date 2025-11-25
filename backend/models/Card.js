const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    cardID: {type: Number, required: true, unique: true},
    deckID: {type: Number, required: true},
    qSide: {type: String, required: true},
    aSide: {type: String, required: true},
    userEmail: {type: String, required: true} 
});

module.exports = mongoose.model('Card', cardSchema);