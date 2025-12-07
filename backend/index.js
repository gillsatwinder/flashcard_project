const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();   //{ path: '../.env' } Use This For Local Dev.


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



// Ping Endpoint To Keep Functions Warm.
app.get('/ping', (req, res) => {
  res.json({ 
    status: 'alive', 
    timestamp: new Date(),
    memory: process.memoryUsage(),
    uptime: process.uptime()
  });
});




// Connect To MongoDB. 
async function connectToDatabase() {
  try {
    
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
    
    console.log("Attempting to connect to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });
    
    console.log("✅ Connected to MongoDB successfully");

    return mongoose.connection;
  } 
  catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}




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
