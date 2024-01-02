const express = require('express');

const todoRoutes = require('../routes/todos');
const userRoutes = require('../routes/users');
const loggerMiddleware = require('../middleware/logger');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(loggerMiddleware);

// router.use('/todo',authMiddleware, todoRoutes);
router.use('/todo', todoRoutes);
router.use('/users', userRoutes);

module.exports = router;