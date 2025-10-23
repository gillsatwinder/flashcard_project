const User = require('../models/User');

//Function for creating a User - MUST VERIFY AJAX CALL USES CORRECT JSON FORMAT AND NAMING.
exports.createUser = async (req, res) => {
  try {
    //Create proper format JSON object w/ userID.
    const UserData = { 
        email: req.body.email, 
        username: req.body.username, 
        password: req.body.password, 
        userID: Math.ceil(Math.random()*100) //Chosen at random for the sake of testing. Will be verified to be free in later implementation
    };
    
    //Will need to verify values are unique and valid prior to saving.
    const user = new User(UserData);
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Updates a User's DB entry.
exports.updateUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const updatedUser = await User.findByIdAndUpdate(userID, req.body, { new: true, runValidators: true });

    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Reads one user by ID
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Deletes a user - NEEDS TO BE SETUP TO CASCADE DELETE
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};