const express = require('express');
const router = express.Router();
const userFuncts = require('../controllers/userFunctions');

//Post /user is for creating a new account.
router.post('/', userFuncts.createUser);

//Put /users/:id is for updating a users entry.
router.put('/:userID', userFuncts.updateUser);

//Get /user is for retrieving a user entry.
router.get('/', userFuncts.getUser);

//Delete /users/:id is for deleting a user's entry. This will may only be an admin ability.
router.delete('/:userID', userFuncts.deleteUser);

//Export the routes.
module.exports = router;