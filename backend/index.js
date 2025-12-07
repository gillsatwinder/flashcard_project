const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();   //{ path: '../.env' } Use This For Local Dev.


const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;




app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));





// Connect To MongoDB. 
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });

    isConnected = true;
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    isConnected = false;
    throw new Error(`Database connection failed: ${error.message}`);
  }
};




// Middleware to ensure database connection
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});





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
if (process.env.NODE_ENV !== 'production') {
  connectToDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}


module.exports = app;
