const deck = require('../schemas/deck');

//Function for creating a Deck
exports.createDeck = async (req, res) => {
  try {
    const deck = new deck(req.body);
    await deck.save();
    res.status(201).json({ message: 'deck created successfully', deck });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Function for updating a Deck
exports.updateDeck = async (req, res) => {
  try {
    const { id } = req.params;
    const updateddeck = await deck.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updateddeck) return res.status(404).json({ error: 'deck not found' });

    res.json({ message: 'deck updated successfully', deck: updateddeck });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ one deck by ID
exports.getDeck = async (req, res) => {
  try {
    const deck = await deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ error: 'deck not found' });
    res.json(deck);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE a deck - NEEDS TO BE SETUP TO CASCADE DELETE
exports.deleteDeck = async (req, res) => {
  try {
    const deleteddeck = await deck.findByIdAndDelete(req.params.id);
    if (!deleteddeck) return res.status(404).json({ error: 'deck not found' });
    res.json({ message: 'deck deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};