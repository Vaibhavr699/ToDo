const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot be more than 30 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password is required only if not using Google OAuth
    },
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined values while maintaining uniqueness
  },
  name: {
    type: String,
    trim: true,
  },
  picture: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to find or create a Google user
userSchema.statics.findOrCreateGoogleUser = async function(googleData) {
  try {
    // Try to find existing user by googleId
    let user = await this.findOne({ googleId: googleData.googleId });
    
    if (!user) {
      // Try to find user by email
      user = await this.findOne({ email: googleData.email });
      
      if (user) {
        // If user exists but doesn't have googleId, update it
        user.googleId = googleData.googleId;
        user.name = googleData.name;
        user.picture = googleData.picture;
        await user.save();
      } else {
        // Create new user
        user = await this.create({
          email: googleData.email,
          googleId: googleData.googleId,
          name: googleData.name,
          picture: googleData.picture,
          username: googleData.email.split('@')[0], // Generate username from email
        });
      }
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
