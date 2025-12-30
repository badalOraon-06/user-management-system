// Import required packages
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Import database connection
const connectDB = require('./config/database');

// Import Express app
const app = require('./app');

// Connect to database
connectDB();

// Emergency route to reactivate admin (remove in production)
const User = require('./models/User');
app.get('/reactivate-admin', async (req, res) => {
  try {
    const admin = await User.findOne({ email: 'admin@example.com' });
    if (admin) {
      admin.status = 'active';
      await admin.save();
      res.json({ success: true, message: 'Admin account reactivated!' });
    } else {
      res.json({ success: false, message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Server configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});