const express = require('express');
const router = express.Router();
const TodoController = require('../controller/todocontroller');

router.get('/', TodoController.getAllTodos);
router.get('/:id', TodoController.getTodoById);
router.post('/', TodoController.createTodo);
router.put('/:id', TodoController.updateTodo);
router.delete('/:id', TodoController.deleteTodo);

module.exports = router;