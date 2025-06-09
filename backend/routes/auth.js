const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middlewares/auth');

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(err => err.message).join(', '),
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error registering user',
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'Please sign in with Google',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userData = user.toObject();
    delete userData.password;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
    });
  }
});

router.post('/google', async (req, res) => {
  try {
    console.log('Received Google OAuth request:', req.body); // Debug log

    const { email, name, googleId, picture } = req.body;

    if (!email || !googleId) {
      console.log('Missing required fields:', { email, googleId }); // Debug log
      return res.status(400).json({
        success: false,
        message: 'Missing required Google OAuth data',
        received: { email, name, googleId, picture }
      });
    }

    // Find or create user
    let user;
    try {
      user = await User.findOrCreateGoogleUser({
        email,
        name,
        googleId,
        picture,
      });
      console.log('User found/created:', { id: user._id, email: user.email }); // Debug log
    } catch (dbError) {
      console.error('Database error during Google user creation:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Error creating/finding user',
        error: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }

    // Generate JWT token
    let token;
    try {
      token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
    } catch (jwtError) {
      console.error('JWT signing error:', jwtError);
      return res.status(500).json({
        success: false,
        message: 'Error generating authentication token',
        error: process.env.NODE_ENV === 'development' ? jwtError.message : undefined
      });
    }

    // Return user data (excluding password)
    const userData = user.toObject();
    delete userData.password;

    console.log('Google login successful for user:', user.email); // Debug log

    res.json({
      success: true,
      message: 'Google login successful',
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Google login error:', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    
    res.status(500).json({
      success: false,
      message: 'Error during Google login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get current user route
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
    });
  }
});

module.exports = router;
