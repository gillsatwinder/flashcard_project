const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: '../.env' });


const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;




// Allows Use Of Following Connections.
// Simple CORS override for debugging
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







// Routes
try {
  const userRoutes = require('./routes/userRoutes');
  const cardRoutes = require('./routes/cardRoutes');
  const deckRoutes = require('./routes/deckRoutes');

  app.use('/api/users', userRoutes);
  app.use('/api/cards', cardRoutes);
  app.use('/api/decks', deckRoutes);

  console.log('Routes loaded successfully');
}
catch (error) {
  console.error('Error loading routes:', error);
}



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




// Connect to MongoDB (for serverless functions)
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MONGODB_URI exists:', !!MONGODB_URI);

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Increased to 10 seconds
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0,
      maxPoolSize: 10, // Limit connection pool
      minPoolSize: 5
    });

    isConnected = true;
    console.log('✅ Connected to MongoDB successfully');

    try {
      await mongoose.connection.db.collection('users').dropIndex('userID_1');
    }
    catch (err) {
      // Index might not exist, that's fine
    }
  }
  catch (error) {
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





// For local development only
if (process.env.NODE_ENV !== 'production') {
  connectToDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  });
}


module.exports = app;
