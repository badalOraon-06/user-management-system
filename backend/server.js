// Import required packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import database connection
const connectDB = require('./config/database');

// Connect to database
connectDB();

// Create Express application
const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to User Management System API',
    status: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

// ===== TEST ROUTE - Remove this later =====
// Import User model
const User = require('./models/User');

// Test route to create a user (using GET for easier testing)
app.get('/test-create-user', async (req, res) => {
  try {
    // Create a test user
    const testUser = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });

    res.status(201).json({
      success: true,
      message: 'Test user created successfully!',
      user: {
        id: testUser._id,
        fullName: testUser.fullName,
        email: testUser.email,
        role: testUser.role,
        status: testUser.status,
        createdAt: testUser.createdAt
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Test route to get all users
app.get('/test-get-users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
// ===== END TEST ROUTES =====

// Server configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});