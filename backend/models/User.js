const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define User Schema
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    lastLogin: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Hash password before saving to database
userSchema.pre('save', async function () {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return;
  }

  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password for login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the model
const User = mongoose.model('User', userSchema);

module.exports = User;