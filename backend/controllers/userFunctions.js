const User = require('../models/User');
const Deck = require('../models/Deck');
const Card = require('../models/Card');

const jwt = require('jsonwebtoken');


//Function for creating a User
exports.createUser = async (req, res) => {
  try {

    //Get the values for a new user from the request body.
    let inUserID = Math.ceil(Math.random() * 10000);
    let inEmail = req.body.email;
    let inUsername = req.body.username;
    let inPassword = req.body.password;

    //Verify that email is not already in use.
    const emailTest = await User.findOne({ email: inEmail });
    if (emailTest) return res.status(400).json({ message: 'Account already exists with that email address' });

    //Verify that username is not already in use
    const usernameTest = await User.findOne({ username: inUsername });
    if (usernameTest) return res.status(400).json({ message: 'Username already in use' });

    //Verify userID is not already in use. Increment and try again if it is.
    let userIDTest = await User.findOne({ userID: inUserID });
    while (userIDTest) {
      inUserID++;
      userIDTest = await User.findOne({ userID: inUserID });
    }

    //Prepare data for new user
    const UserData = {
      userID: inUserID,
      email: inEmail,
      username: inUsername,
      password: inPassword,
    };

    //Create new user and save into the DB.
    const user = new User(UserData);
    await user.save();
    console.log(`User Successfully Created: ${user}`);
    res.status(201).json({ UserID: user.userID });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




//Updates a User's DB entry.
exports.updateUser = async (req, res) => {
  try {
    //Get the input values from the request parameters and body.
    const { userID } = req.params;
    const { email, username, password } = req.body;
    let updatedUser;

    //Check if all inputs are empty strings. Return 400 in this case.
    if (!email && !username && !password) {
      return res.status(400).json({ message: "Email, Username, and password text cannot all be empty strings." })
    }

    //If email isn't empty, update it.
    if (email) {
      updatedUser = await User.findOneAndUpdate(
        { userID: userID },
        { email: email },
        { new: true }
      );
    }
    //If username isn't empty, update it.
    if (username) {
      updatedUser = await User.findOneAndUpdate(
        { userID: userID },
        { username: username },
        { new: true }
      );
    }
    //If password isn't empty, update it.
    if (password) {
      updatedUser = await User.findOneAndUpdate(
        { userID: userID },
        { password: password },
        { new: true }
      );
    }

    //If no user could be found, return 404.
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    //Return the updated User if successful.
    console.log(`User updated: ID ${userID}`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating User:", error);
    res.status(500).json({ message: 'Error updating User', error: error.message });
  }
}


//Reads one user using the email address to search for it.
exports.getUser = async (req, res) => {
  try {
    const { email } = req.params.email;

    //Check to see if there is a user for the provided email. 
    //Return the user if found. Return 404 otherwise.
    if (email) {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json({ userID: user.userID });
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
    const userDecks = await Deck.find({ userID: userID });

    //Compile all deckIDs for to for Deck and Card deletion
    const deckIDs = userDecks.map(deck => deck.deckID);

    //Delete all decks belonging to this user
    const deletedDecks = await Deck.deleteMany({ userID: userID });

    //Delete all cards belongin to those decks
    const deletedCards = await Card.deleteMany({ deckID: { $in: deckIDs } });

    //Return a report of how many decks and cards were deleted with the user.
    res.status(200).json({ success: true, message: `User, ${deletedDecks.deletedCount} Deck(s), and ${deletedCards.deletedCount} Card(s) deleted.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}



exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) { return res.status(400).json({ message: 'Email and password are required' }); }


    const user = await User.findOne({ email });
    if (!user) { return res.status(404).json({ message: 'Invalid login.' }); }
    // Using the 'user' defined throught the email search to check the password. Saves loading time rather than starting a new search.
    if (user.password !== password) { return res.status(401).json({ message: 'Invalid email or password' }); }


    // Creating token. Carries userID, email, and name.
    const token = jwt.sign(
      {
        userID: user.userID,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET || 'your-secret-key', // Use environment variable for security
      { expiresIn: '24h' } // Token expires in 24 hours
    );

    console.log("User logged in successfully:", email);
    return res.status(200).json({
      token: token,
      user: {
        userID: user.userID,
        email: user.email,
        username: user.username
      }
    });

  }
  catch (error) {
    console.log("Failed to login!!");
    res.status(500).json({ error: error.message });
  }
}

