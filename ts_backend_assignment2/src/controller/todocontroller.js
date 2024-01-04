const db = require('../db/db');
const UnauthenticatedError = require("../error/unauthenticatedError");
const BadRequestError = require("../error/badRequestError");
const notfoundError = require("../error/notfoundError");
const internalServerError = require("../error/internalServerError");

const { createtodoTable } = require('../models/todoModel');
const { todoSchema } = require('../schema/todoschema');

const TodoController = {
  getAllTodos: async (req, res) => {
    try {
      const todos = await db.any('SELECT * FROM todos');
      res.json(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      //throw new internalServerError("internal server error");
    }
  },

  getTodoById: async (req, res) => {
    try {
      const todoId = parseInt(req.params.id);
      const todo = await db.oneOrNone('SELECT * FROM todos WHERE id = $1', [todoId]);

      if (!todo) {
        //return res.status(404).json({ error: 'Todo not found' });
        // throw new notfoundError('Todo not found');
      }

      res.json(todo);
    } catch (error) {
      console.error('Error fetching todo by ID:', error);
      // res.status(500).json({ error: 'Internal Server Error' });
      throw new internalServerError("internal server error");
    }
  },

  createTodo: async (req, res) => {
    try {
      const { error } = todoSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const { task, completed } = req.body;

      if (!task) {
        return res.status(400).json({ error: 'Task is required' });
      }

      const newTodo = await db.one('INSERT INTO todos (task, completed) VALUES ($1, $2) RETURNING *', [task, completed || false]);
      res.json(newTodo);
    } catch (error) {
      console.error('Error creating todo:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      //throw new internalServerError("internal server error");
    }
  },

  updateTodo: async (req, res) => {
    try {
      const todoId = parseInt(req.params.id);
      const { task, completed } = req.body;

      const updatedTodo = await db.oneOrNone('UPDATE todos SET task = $1, completed = $2 WHERE id = $3 RETURNING *', [task, completed || false, todoId]);

      if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
        //throw new notfoundError('Todo not found');
      }

      res.json(updatedTodo);
    } catch (error) {
      console.error('Error updating todo:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      //throw new internalServerError("internal server error");
    }
  },

  deleteTodo: async (req, res) => {
    try {
      const todoId = parseInt(req.params.id);

      const result = await db.result('DELETE FROM todos WHERE id = $1', [todoId]);

      if (result.rowCount === 0) {
        //return res.status(404).json({ error: 'Todo not found' });
        throw new notfoundError('Todo not found');
      }

      res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
      console.error('Error deleting todo:', error);
      res.status(500).json({ error: 'Internal Server Error' });
      //throw new internalServerError("internalaaa server error");
    }
  },
};

module.exports = TodoController;


