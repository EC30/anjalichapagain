const express = require('express');
const router = express.Router();
const { UserController, getUserById } = require('../controller/usercontroller');
const authMiddleware = require('../middleware/auth');

// Define routes
router.get('/', UserController.getAllUsers);
router.get('/:id', getUserById);
router.post('/', UserController.createUser);
router.post('/signIn', UserController.signIn);
// router.post('/check', UserController.checkUserAccess);
router.post('/refreshToken', UserController.refreshToken);

module.exports = router;
