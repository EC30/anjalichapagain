const Joi = require('joi');

const todoIdSchema = Joi.number().integer().positive().required().messages({
  'number.base': 'Todo ID must be a positive integer',
  'number.integer': 'Todo ID must be a positive integer',
  'number.positive': 'Todo ID must be a positive integer',
  'any.required': 'Todo ID is required',
});

const todoSchema = Joi.object({
  task: Joi.string().required().messages({
    'string.base': 'Task must be a string',
    'any.required': 'Task is required',
  }),
  completed: Joi.boolean().messages({
    'boolean.base': 'Completed must be a boolean',
  }),
});

module.exports = {
  todoIdSchema,
  todoSchema,
};
