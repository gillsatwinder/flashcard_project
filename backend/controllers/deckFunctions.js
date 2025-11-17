const Deck = require('../models/Deck');
const User = require('../models/User');
const Card = require('../models/Card');

//Creates a new deck
exports.createDeck = async (req, res) => {
  try {

    //userID is assumed to be handed to the function with legitimate value.
    let inDeckID = Math.ceil(Math.random() * 10000);
    let inUserID = req.body.userID;
    let inTitle = req.body.title;

    const userIDTest = await User.findOne({userID: inUserID});
    if(!userIDTest) return res.status(400).json({ error: "No user exists with the provided userID"});

    //May implement a length limit to the title - Might want to do that on the front end though.
    //Ensure that the title is not empty.
    if(!inTitle) return res.status(400).json({ error: "Decks cannot have an empty title"});

    //Ensure that the deckID generated is unique.
    let deckIDTest = await Deck.findOne({deckID: inDeckID});
    while(deckIDTest){
      inDeckID++;
      deckIDTest = await Deck.findOne({deckID: inDeckID});
    }

    //Prep new deck data.
    const deckData = {
      deckID: inDeckID,
      userID: inUserID,
      title: inTitle
    };

    //Create new deck and save it to the DB.
    const deck = new Deck(deckData);  // Use Deck constructor
    await deck.save();
    res.status(201).json({ message: 'Deck created successfully', deck });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Updates an existing deck - Should only need to update title.
exports.updateDeck = async (req, res) => {
  try {
    //Get the deckID from the request parameters and update the deck with that value.
    const { deckID } = req.params;

    let inTitle = req.body.title;
    if(!inTitle) return res.status(400).json({ error: "Decks cannot have an empty title"});

    const updatedDeck = await Deck.findOneAndUpdate({deckID: deckID }, req.body, { new: true });

    //Return 404 if no deck matches that deckID.
    if (!updatedDeck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    //Return success otherwise.
    res.json({ message: 'Deck updated successfully', deck: updatedDeck });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//Retrieves a deck by deckID
exports.getDeck = async (req, res) => {
  try {
    //Get the deckID from the request parameters and search for it.
    const { deckID } = req.params;
    const deck = await Deck.findOne({ deckID: deckID });

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


//Retrieves all decks for a given userID
exports.getAllDecks = async (req, res) => {
  try {

    //Get the userID from the request parameters and search for decks with this userID.
    const { userID } = req.params;
    const decks = await Deck.find({ userID: userID });

    if (decks.length === 0) {
      return res.status(404).json({ message: 'No decks found for this user.' });
    }

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
    res.json({ message: `Deck and ${cascade.deletedCount} card(s) deleted` });
  } catch (err) {
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