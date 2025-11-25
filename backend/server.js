const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: '../.env' });


const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;





// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));







// Routes
const userRoutes = require('./routes/userRoutes');
const cardRoutes = require('./routes/cardRoutes');
const deckRoutes = require('./routes/deckRoutes');

app.use('/api/users', userRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/decks', deckRoutes);







// Root route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Flashcard API Server', 
    status: 'Server is running!', 
    port: PORT,
    endpoints: {
      health: '/health',
      users: '/api/users',
      cards: '/api/cards',
      decks: '/api/decks'
    }
  });
});



// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Drop the old userID index if it exists
    try {
      await mongoose.connection.db.collection('users').dropIndex('userID_1');
    } catch (err) {
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });