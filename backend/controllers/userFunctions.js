const User = require('../models/User');
const Deck = require('../models/Deck');
const Card = require('../models/Card');

//Function for creating a User - MUST VERIFY AJAX CALL USES CORRECT JSON FORMAT AND NAMING.
exports.createUser = async (req, res) => {
  try {

    //Get the values for a new user from the request body.
    let inEmail = req.body.email;
    let inUsername = req.body.username;
    let inPassword = req.body.password;
    let inUserID = Math.ceil(Math.random()*10000) //Chosen at random for the sake of testing. Will be verified to be free in later implementation

    //Verify that email is not already in use.
    const emailTest = await User.findOne({ email: inEmail });
    if(emailTest) return res.status(400).json({ message: 'Account already exists with that email address' });
    
    //Verify that username is not already in use
    const usernameTest = await User.findOne({username: inUsername });
    if(usernameTest) return res.status(400).json({ message: 'Username already in use' });
    
    //Ensure that new userID is generated.
    let userIDTest = await User.findOne({ userID: inUserID });
    while(userIDTest){
      inUserID++;
      userIDTest = await User.findOne({ inUserID });
    }
    

    //Prepare data for new user
    const UserData = { 
        email: inEmail, 
        username: inUsername, 
        password: inPassword, 
        userID: inUserID
    };

    //Create new user and save into the DB.
    const user = new User(UserData);
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Updates a User's DB entry.
//Note: MongoDB's uniqueness requirements from the schema is used here to ensure
//      that updates don't create data collisions for usernames, emails, and userIDs.
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { userID: req.params.userID },
      req.body,
      { new: true }
    );

    //Return 404 if no user could be found.
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //Return a success message if successful and return error otherwise.
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

//Reads one user using the email address to search for it.
exports.getUser = async (req, res) => {
  try {
    const { email } = req.query;

    //Check to see if there is a user for the provided email. 
    //Return the user if found. Return 404 otherwise.
    if (email) {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json(user);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//Deletes a user identified using userID to find
exports.deleteUser = async (req, res) => {
  try {
    //Get teh userID from the request parameters.
    const userID = req.params.userID;
    //Delete user
    const result = await User.findOneAndDelete({ userID: userID });

    //Return 404 if user could not be found. Return success otherwise.
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    //Find all decks belonging to this user
    const userDecks = await Deck.find({ userID: userID});

    //Compile all deckIDs for to for Deck and Card deletion
    const deckIDs = userDecks.map(deck => deck.deckID);

    //Delete all decks belonging to this user
    const deletedDecks = await Deck.deleteMany({ userID: userID });

    //Delete all cards belongin to those decks
    const deletedCards = await Card.deleteMany({ deckID: { $in: deckIDs } });

    //Return a report of how many decks and cards were deleted with the user.
    res.status(200).json({ message: `User, ${deletedDecks.deletedCount} Deck(s), and ${deletedCards.deletedCount} Card(s) deleted.`});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}