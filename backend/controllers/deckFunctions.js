const Deck = require('../models/Deck');
const User = require('../models/User');
const Card = require('../models/Card');

//Creates a new deck
exports.createDeck = async (req, res) => {
  try {

    //userID is assumed to be handed to the function with legitimate value.
    let deckID = Math.ceil(Math.random() * 10000);
    let userEmail = req.body.userEmail;  
    let title = req.body.title;

    const userIDTest = await User.findOne({ email: userEmail });
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
      userEmail: userEmail,
      title: title
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
    if (!inTitle) return res.status(400).json({ error: "Decks cannot have an empty title" });

    const updatedDeck = await Deck.findOneAndUpdate({ deckID: deckID }, req.body, { new: true });

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

    //Get the userEmail from the request parameters and search for decks with this userID.
    const { userEmail } = req.params;
    const decks = await Deck.find({ userEmail: userEmail });

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

//Shares a deck by creating a copy for another user
exports.shareDeck = async (req, res) => {
  try {
    const { deckID } = req.params;
    const { recipientEmail } = req.body;

    //Validate recipientEmail is provided
    if (!recipientEmail) {
      return res.status(400).json({ error: "Recipient email is required" });
    }

    //Find the original deck
    const originalDeck = await Deck.findOne({ deckID: deckID });
    if (!originalDeck) {
      return res.status(404).json({ error: "Deck not found" });
    }

    //Find the recipient user by email
    const recipientUser = await User.findOne({ email: recipientEmail });
    if (!recipientUser) {
      return res.status(404).json({ error: "User with this email not found" });
    }

    //Generate unique deckID for the new deck
    let newDeckID = Math.ceil(Math.random() * 10000);
    let deckIDTest = await Deck.findOne({ deckID: newDeckID });
    while (deckIDTest) {
      newDeckID++;
      deckIDTest = await Deck.findOne({ deckID: newDeckID });
    }

    //Create the new deck for the recipient
    const newDeck = new Deck({
      deckID: newDeckID,
      userID: recipientUser.userID,
      title: originalDeck.title
    });
    await newDeck.save();

    //Find all cards in the original deck
    const originalCards = await Card.find({ deckID: deckID });

    //Clone all cards to the new deck
    const clonedCards = [];
    for (const card of originalCards) {
      //Generate unique cardID
      let newCardID = Math.ceil(Math.random() * 10000);
      let cardIDTest = await Card.findOne({ cardID: newCardID });
      while (cardIDTest) {
        newCardID++;
        cardIDTest = await Card.findOne({ cardID: newCardID });
      }

      //Create new card
      const newCard = new Card({
        cardID: newCardID,
        deckID: newDeckID,
        qSide: card.qSide,
        aSide: card.aSide
      });
      await newCard.save();
      clonedCards.push(newCard);
    }

    res.status(201).json({
      message: 'Deck shared successfully',
      deck: newDeck,
      cardsShared: clonedCards.length
    });
  } catch (error) {
    console.error('Error sharing deck:', error);
    res.status(500).json({ error: error.message });
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