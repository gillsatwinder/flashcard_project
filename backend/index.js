const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();   //{ path: '../.env' } Use This For Local Dev.


const app = express();
const PORT = process.env.PORT || 8080;


// CORS Protection. Allows All Connections.
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));






// Connect To MongoDB. Protects Against Test Envrionment.
if (process.env.NODE_ENV !== 'test') {
  let isConnected = false;

  app.use(async (req, res, next) => {
    if (!isConnected) {
      try {
        await mongoose.connect(process.env.MONGODB_URI, {
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000
        });
        isConnected = true;
        console.log('✅ Connected to MongoDB successfully');
      } 
      catch (error) {
        return res.status(500).json({ error: 'Database connection failed' });
      }
    }
    next();
  });
}





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




// For local development only
if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  connectToDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}


module.exports = app;
