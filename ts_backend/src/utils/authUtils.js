const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/db');

const hashPassword = async (password) => {
    try {
      const hash = await bcrypt.hash(password, 10); 
      return hash;
    } catch (error) {
      throw error;
    }
  };
  const comparePassword = async (password, hash) => {
    try {
      const match = await bcrypt.compare(password, hash);
      return match;
    } catch (error) {
      throw error;
    }
  };

  const generateRefreshToken = () => {
    return uuidv4();
  };
  
  const validateRefreshToken = async (refreshToken) => {
    try {
      // Check if the refresh token exists in the database
      const result = await db.oneOrNone('SELECT id FROM users WHERE refresh_token = $1', [refreshToken]);
  
      // Return true if the refresh token exists, false otherwise
      return result !== null;
    } catch (error) {
      console.error('Error validating refresh token:', error);
      return false;
    }
  };
  
  const getUserByRefreshToken = async (refreshToken) => {
    try {
      // Retrieve user information based on the refresh token
      const userRecord = await db.oneOrNone('SELECT id FROM users WHERE refresh_token = $1', [refreshToken]);
  
      // Return the user object if found, null otherwise
      return userRecord;
    } catch (error) {
      console.error('Error retrieving user by refresh token:', error);
      return null;
    }
  };
  function validateAccessToken(req, res, next) {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ error: 'Access token missing' });
    }
    // Split the token correctly
    const bearer = token.split(" ");
    
    if (bearer.length !== 2) {
      return res.status(401).json({ error: 'Invalid access token format' });
    }
    req.token = bearer[1]; // Set the token in the request object
    next();
  }



  module.exports = {
    hashPassword,
    comparePassword,
    generateRefreshToken,
    validateRefreshToken,
    getUserByRefreshToken,
    validateAccessToken,
  };