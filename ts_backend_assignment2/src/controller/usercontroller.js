const express = require('express');
const router = express.Router();
const HttpStatus = require("http-status-codes");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const db = require('../db/db');

const { createUserTable } = require('../models/userModel');
const { validateAccessToken, validateRefreshToken, getUserByRefreshToken } = require('../utils/authUtils');
const { createLogger } = require('../utils/logger');
const { userIdSchema, userSchema } = require('../schema/userschema');
const UnauthenticatedError = require("../error/unauthenticatedError");
const BadRequestError = require("../error/badRequestError");
const notfoundError = require("../error/notfoundError");
const internalServerError = require("../error/internalServerError");
const { genericErrorHandler } = require('../middleware/errorHandler');
// const { UnauthenticatedError, BadRequestError, NotFoundError, InternalServerError, genericErrorHandler } = require('../middleware/errorHandler');


const logger = createLogger('UserController');

const UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await db.any('SELECT * FROM users');
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      // throw new internalServerError("Internal Server error");
    }
  },

  createUser: async (req, res) => {
    try {
      const { error } = userSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      const { username, password, fullname, phone, email } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const refreshToken = uuidv4();

      const newUser = await db.one('INSERT INTO users (username, password, fullname, phone, email, refresh_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [username, hashedPassword, fullname, phone, email, refreshToken]);
      res.json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      //throw new internalServerError("Internal Server error");
    }
  },

  signIn: async (req, res) => {
    const { username, password } = req.body;

    try {
      const userRecord = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);

      if (!userRecord) {
        console.log("User not found");
        return res.status(401).json({ error: "Login failed" });
        //throw new UnauthenticatedError("Login failed");
      }

      const isPasswordValid = await bcrypt.compare(password, userRecord.password);

      if (isPasswordValid) {
        const accessToken = jwt.sign(
          { userId: userRecord.id, username: userRecord.username },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '600s' }
        );
        const refreshToken = userRecord.refresh_token;

        console.log("Logged in successfully");
        res.status(200).json({ message: "Logged in successfully", accessToken, refreshToken });
      } else {
        console.log("Login failed");
        res.status(401).json({ error: "Login failed" });
      }
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      throw new internalServerError("internal server error");
    }
  },
  refreshToken: async (req, res) => {
    const { refreshToken } = req.body;

    try {
      // Check if the refresh token is valid
      const isValidRefreshToken = await validateRefreshToken(refreshToken);

      if (!isValidRefreshToken) {
        return res.status(401).json({ error: 'Invalid refresh token' });
        //throw new UnauthenticatedError("Invalid refresh token");
      }

      // Obtain user information from the refresh token
      const userRecord = await getUserByRefreshToken(refreshToken);

      if (!userRecord) {
        return res.status(401).json({ error: 'Invalid user token' });
        // throw new notfoundError("Invalid user token");
      }

      // Generate a new access token
      const newAccessToken = jwt.sign(
        { userId: userRecord.id, username: userRecord.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '60s' }
      );

      console.log("Access token refreshed successfully");
      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      //throw new internalServerError('internal server error');
    }
  },
};

const getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [userId]);

    if (!user) {
      logger.error('User not found');
      //return res.status(404).json({ error: 'User not found' });
      throw new notfoundError("user not found");
    }
    res.json(user);

  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new internalServerError("user not found");
    //res.status(500).json({ error: 'Internal Server Error' });
  }
};
router.use(genericErrorHandler);
module.exports = {
  UserController,
  getUserById, 
  router 
};
