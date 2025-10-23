const Deck = require('../models/Deck');  // Changed from 'deck' to 'Deck'

exports.createDeck = async (req, res) => {
  try {
    const deckData = {
      deckID: Math.ceil(Math.random() * 100000),
      userID: req.body.userID,
      title: req.body.title
    };
    
    const deck = new Deck(deckData);  // Use Deck constructor
    await deck.save();
    res.status(201).json({ message: 'Deck created successfully', deck });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateDeck = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDeck = await Deck.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updatedDeck) return res.status(404).json({ error: 'Deck not found' });

    res.json({ message: 'Deck updated successfully', deck: updatedDeck });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getDeck = async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ error: 'Deck not found' });
    res.json(deck);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDeck = async (req, res) => {
  try {
    const deletedDeck = await Deck.findByIdAndDelete(req.params.id);
    if (!deletedDeck) return res.status(404).json({ error: 'Deck not found' });
    res.json({ message: 'Deck deleted successfully', deck: deletedDeck });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};