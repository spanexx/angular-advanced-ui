const axios = require('axios');
const User = require('../models/user.model');

const AUTH_SERVICE_URL = 'https://auth-service-5971.onrender.com';

// Register a new user via external Auth Service and save to local DB
const registerUser = async (req, res) => {
  try {
    const { username, firstName, lastName, email, password } = req.body;
    // Register with external Auth Service
    const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/register`, {
      username,
      firstName,
      lastName,
      email,
      password
    });
    const { user } = response.data;
    // Use any available id field from the user object
    const authId = user._id || user.id || user.authId;
    if (!authId) {
      throw new Error('No user id returned from Auth Service');
    }
    // Save user to local DB if not exists
    let localUser = await User.findOne({ authId });
    if (!localUser) {
      localUser = await User.create({
        authId,
        email: user.email,
        name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        provider: user.provider || 'local',
        avatar: user.avatar || ''
      });
    }
    console.log('User registered and synced:', localUser);
    res.json({ user: localUser });
  } catch (error) {
    console.error('Registration error:', error);
    const msg = error.response?.data || error.message;
    res.status(400).json({ error: msg });
  }
};

// Login user via external Auth Service and sync to local DB
const loginUser = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    // Login with external Auth Service
    const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/login`, { emailOrUsername, password });
    const { user, token } = response.data;
    // Use any available id field from the user object
    const authId = user._id || user.id || user.authId;
    if (!authId) {
      throw new Error('No user id returned from Auth Service');
    }
    // Find user in local DB
    let localUser = await User.findOne({ authId });
    // If user doesn't exist in local DB, create a new record
    if (!localUser) {
      localUser = await User.create({
        authId,
        email: user.email,
        name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        provider: user.provider || 'local',
        avatar: user.avatar || ''
      });
    }
    console.log('Response:', response.data);
    // Respond with user data and token
    res.json({
      user: localUser, 
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken
       });
  } catch (error) {
    console.error('Login error:', error);
    const msg = error.response?.data || error.message;
    res.status(400).json({ error: msg });
  }
};

module.exports = { registerUser, loginUser };
