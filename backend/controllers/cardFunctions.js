const Card = require('../models/Card');
const Deck = require('../models/Deck');

//creates a card 
exports.createCard = async (req, res) => {
  try {


    const { deckID, qSide, aSide, userEmail } = req.body; // Get userEmail from the request


    // Verifying all necessary data is not empty.
    if (!deckID) return res.status(400).json({ error: 'deckID is required' });
    if (!qSide) return res.status(400).json({ error: 'Question side text cannot be empty' });
    if (!aSide) return res.status(400).json({ error: 'Answer side text cannot be empty' });
    if (!userEmail) return res.status(400).json({ error: 'userEmail is required' });

    const cardData = { cardID: Math.floor(Math.random() * 10000), deckID, userEmail, qSide, aSide };

    //Ensure that the deckID belongs to existing deck.
    const deckIDTest = await Deck.findOne({ deckID: deckID });
    if (!deckIDTest) return res.status(404).json({ error: 'Deck not found' });

    //Ensure that the cardID generated is unique.
    let cardIDTest = await Card.findOne({ cardID: cardData.cardID });
    while (cardIDTest) {
      cardData.cardID++;
      cardIDTest = await Card.findOne({ cardID: cardData.cardID });
    }



    //Create new card and save to the DB.
    const card = new Card(cardData);
    await card.save();
    res.status(201).json({ message: 'Card created successfully', card });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


//Updates a card identified by cardID
exports.updateCard = async (req, res) => {
  try {

    //Get the input values from the request parameters and body.
    const { cardID } = req.params;
    const { qside, aside } = req.body;
    let updatedCard;

    //Check if both are empty strings. Return 400 in this case.
    if (!qside && !aside) {
      return res.status(400).json({ message: "Question and Answer text cannot be empty strings." })
    }

    //If Q-Side is empty, only update A-Side.
    if (!qside) {
      updatedCard = await Card.findOneAndUpdate(
        { cardID: cardID },
        { aSide: aside },
        { new: true } // return updated doc
      );
    }
    //If A-Side is empty, only update Q-Side.
    else if (!aside) {
      updatedCard = await Card.findOneAndUpdate(
        { cardID: cardID },
        { qSide: qside },
        { new: true } // return updated doc
      );
    }
    //otherwise, update both values.
    else {
      updatedCard = await Card.findOneAndUpdate(
        { cardID: cardID },
        { qSide: qside, aSide: aside },
        { new: true } // return updated doc
      );
    }

    //If no card could be found, return 404.
    if (!updatedCard) {
      return res.status(404).json({ message: 'Card not found.' });
    }

    //Return the updated card if successful.
    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: 'Error updating card', error: error.message });
  }
};


//Retrieves a card identified by cardID
exports.getCard = async (req, res) => {
  try {
    //Gets the cardID from the request parameters and searches for a card matching.
    const { cardID } = req.params;
    const card = await Card.findOne({ cardID: cardID });

    //Return 404 if no match.
    if (!card) {
      return res.status(404).json({ message: 'Card not found.' });
    }

    //Return the card if successful.
    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving card', error: error.message });
  }
};


//Retrieves all cards identified by a deckID.
exports.getAllCards = async (req, res) => {
  try {
    //Get the deckID from the request parameters then search for cards with the deckID.
    const { deckID } = req.params;
    const { userEmail } = req.query;

    if (!userEmail) { return res.status(400).json({ message: 'userEmail is required' }); }

    const cards = await Card.find({ deckID: deckID,  userEmail: userEmail  });

    //Return the cards if successful.
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving cards', error: error.message });
  }
};


//Deletes a card identified by cardID
exports.deleteCard = async (req, res) => {
  try {
    //Get the cardID from the request parameters and then search for it and delete it.
    const { cardID } = req.params;
    const deleted = await Card.findOneAndDelete({ cardID });

    //Return 404 if the card could not be found.
    if (!deleted) {
      return res.status(404).json({ message: 'Card not found.' });
    }

    //Return success message if deletion was successful.
    res.status(200).json({ message: 'Card deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting card', error: error.message });
  }
};


//Deletes all cards with a specific deckID - Only needed for testing cleanup. Not for actual implementation.
exports.deleteCardsByDeck = async (req, res) => {
  try {
    //Get the deckID from request parameters
    const { deckID } = req.params;

    //Delete the cards with the deckID provided
    const result = await Card.deleteMany({ deckID: deckID });

    //Return 404 if no cards were found to be deleted.
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No cards found to delete for this deck.' });
    }

    //Return a success message if the deletion was successful.
    res.status(200).json({ message: `Deleted ${result.deletedCount} card(s).` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting cards', error: error.message });
  }
};