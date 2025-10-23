const Card = require('../models/Card');



//Function for creating a card
exports.createCard = async (req, res) => {
  try {
    const cardData = {
      cardID: Math.ceil(Math.random() * 100000), // Generate unique cardID
      deckID: req.body.deckID,
      qSide: req.body.qSide,
      aSide: req.body.aSide
    };
    
    const card = new Card(cardData);
    await card.save();
    res.status(201).json({ message: 'Card created successfully', card });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};





//Function for updating a card
exports.updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCard = await Card.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updatedCard) return res.status(404).json({ error: 'Card not found' });

    res.json({ message: 'Card updated successfully', card: updatedCard });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};





// Read a  card by ID
exports.getCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// read all cards. Thought i'd add this function in.
exports.getAllCards = async (req, res) => {
  try {
    const { deckID } = req.query;
    let filter = {};
    
    if (deckID) {
      filter.deckID = deckID;
    }
    
    const cards = await Card.find(filter);
    res.json({ message: 'Cards retrieved successfully', cards });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





// Delete a card
exports.deleteCard = async (req, res) => {
  try {
    const deletedCard = await Card.findByIdAndDelete(req.params.id);
    if (!deletedCard) return res.status(404).json({ error: 'Card not found' });
    res.json({ message: 'Card deleted successfully', card: deletedCard });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





// Delete all cards in a specific deck
exports.deleteCardsByDeck = async (req, res) => {
  try {
    const { deckID } = req.params;
    const result = await Card.deleteMany({ deckID: deckID });
    res.json({ 
      message: `${result.deletedCount} cards deleted from deck ${deckID}`, 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};