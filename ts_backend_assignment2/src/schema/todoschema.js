const Joi = require('joi');

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
  todoSchema
};
