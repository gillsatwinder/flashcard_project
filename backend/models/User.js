const mongoose = require('mongoose');

//Definition of DB Schemas
const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true}, 
    username: {type: String, required: true, unique: true},
    password: {type: String}, //Will need to hash in future implementations
});

//Export the schema
module.exports = mongoose.model('User', userSchema);