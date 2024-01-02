const express = require('express');
const router = express.Router();
const UserController = require('../controller/usercontroller');

// Define routes
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);
router.post('/signIn', UserController.signIn);
// router.post('/check', UserController.checkUserAccess);
router.post('/refreshToken', UserController.refreshToken);

module.exports = router;
