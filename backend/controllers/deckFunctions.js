const Deck = require('../models/Deck');
const User = require('../models/User');
const Card = require('../models/Card');

//Creates a new deck
exports.createDeck = async (req, res) => {
  try {

    //userID is assumed to be handed to the function with legitimate value.
    let deckID = Math.ceil(Math.random() * 10000);
    let userID = req.body.userID;
    let title = req.body.title;

    const userIDTest = await User.findOne({ userID: userID });
    if (!userIDTest) return res.status(400).json({ error: "No user exists with the provided userID" });

    //May implement a length limit to the title - Might want to do that on the front end though.
    //Ensure that the title is not empty.
    if (!title) return res.status(400).json({ error: "Decks cannot have an empty title" });

    //Ensure that the deckID generated is unique.
    let deckIDTest = await Deck.findOne({ deckID: deckID });
    while (deckIDTest) {
      deckID++;
      deckIDTest = await Deck.findOne({ deckID: deckID });
    }

    //Prep new deck data.
    const deckData = {
      deckID: deckID,
      userID: userID,
      title: title
    };

    //Create new deck and save it to the DB.
    const deck = new Deck(deckData);  // Use Deck constructor
    await deck.save();
    console.log(`Deck created: ID ${deck.deckID}, Title "${deck.title}", User ${deck.userID}`);
    res.status(201).json({ deckID: deck.deckID });
  } catch (error) {
    console.error("Error creating deck:", error);
    res.status(400).json({ error: error.message });
  }
};



//Updates an existing deck - Should only need to update title.
exports.updateDeck = async (req, res) => {
  try {
    //Get the deckID from the request parameters and update the deck with that value.
    const { deckID } = req.params;

    let inTitle = req.body.title;
    if (!inTitle) return res.status(400).json({ success: false, error: "Decks cannot have an empty title" });

    const updatedDeck = await Deck.findOneAndUpdate({ deckID: deckID }, req.body, { new: true });

    //Return 404 if no deck matches that deckID.
    if (!updatedDeck) {
      return res.status(404).json({ success: false, message: 'Deck not found' });
    }

    //Return success otherwise.
    console.log(`Deck updated: ID ${deckID}, New Title "${updatedDeck.title}"`);
    res.json({ sucess: true, message: 'Deck updated successfully'});
  } catch (err) {
    console.error("Error updating deck:", err);
    res.status(400).json({ success: false, error: err.message });
  }
};




//Retrieves a deck by deckID
exports.getDeck = async (req, res) => {
  try {
    //Get the deckID from the request parameters and search for it.
    const { deckID } = req.params;
    const deck = await Deck.findOne({ deckID: deckID }).select({deckID: 1, title: 1, isFavorite: 1});

    //Return 404 if no deck could be found.
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    //Return the deck if successful.
    res.json(deck);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//Retrieves a deck by Title and User Email
exports.getDeckByTitle = async (req, res) => {
  try {
    const { title, userID } = req.query;

    if (!title || !userID) {
      return res.status(400).json({ error: 'Title and userID are required' });
    }

    const deck = await Deck.findOne({ title: title, userID: userID });

    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    res.json(deck);
  } catch (err) {
    console.error('Error finding deck by title:', err);
    res.status(500).json({ error: err.message });
  }
};


//Retrieves all decks for a given userID
exports.getAllDecks = async (req, res) => {
  try {

    //Get the userID from the request parameters and search for decks with this userID.
    const { userID } = req.params;
    const decks = await Deck.find({ userID: userID }).select({deckID: 1, title: 1, isFavorite: 1, _id: 0});

    //Return the decks found.
    res.json(decks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




//Deletes a specific deck identified by deckID.
exports.deleteDeck = async (req, res) => {
  try {
    //Get the deckID from the request parameters then find the deck and delete it.
    const { deckID } = req.params;
    const result = await Deck.findOneAndDelete({ deckID: deckID });

    //Return 404 if no decks could be found.
    if (!result) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    //Cascade delete cards in this deck.
    const cascade = await Card.deleteMany({ deckID: deckID });

    //Return success if the deck was deleted.
    console.log(`Deck deleted: ID ${deckID} and ${cascade.deletedCount} cards.`);
    res.json({success: true, message: `Deck and ${cascade.deletedCount} card(s) deleted`});
  } catch (err) {
    console.error("Error deleting deck:", err);
    res.status(500).json({ error: err.message });
  }
};

//Deletes all decks corresponding to a given userID - Only needed for testing cleanup. Not for actual implementation
exports.deleteAllDecks = async (req, res) => {
  try {
    //Get the userID from the request parameters then delete all decks with that userID.
    const { userID } = req.params;
    const result = await Deck.deleteMany({ userID: userID });

    //Return 404 if no cards were found to be deleted.
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No decks found to delete for this deck.' });
    }

    //Show the number of decks deleted - Note: this may be 0.
    res.json({ message: `${result.deletedCount} deck(s) deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



//Toggles the favorite status of a deck
exports.toggleFavorite = async (req, res) => {
  try {
    const { deckID } = req.params;

    //Find the deck
    const deck = await Deck.findOne({ deckID: deckID });
    if (!deck) {
      return res.status(404).json({ error: "Deck not found" });
    }

    //Toggle the isFavorite field
    deck.isFavorite = !deck.isFavorite;
    await deck.save();

    res.json({
      message: `Deck ${deck.isFavorite ? 'added to' : 'removed from'} favorites`,
      deck: deck
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: error.message });
  }
};