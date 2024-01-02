const Joi = require('joi');

const userIdSchema = Joi.number().integer().positive().required().messages({
  'number.base': 'User ID must be a positive integer',
  'number.integer': 'User ID must be a positive integer',
  'number.positive': 'User ID must be a positive integer',
  'any.required': 'User ID is required',
});

const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Username must be at least {#limit} characters long',
    'string.max': 'Username must not exceed {#limit} characters',
    'any.required': 'Username is required',
  }),
  password: Joi.string().min(6).max(30).required().messages({
    'string.min': 'Password must be at least {#limit} characters long',
    'string.max': 'Password must not exceed {#limit} characters',
    'any.required': 'Password is required',
  }),
  fullname: Joi.string()
    .required()
    .regex(/^[a-zA-Z]+ [a-zA-Z]+$/, { name: 'full name format' })
    .error(new Error('Full name must consist of first name and last name separated by a space')),
  phone: Joi.string().min(10).max(15).required().messages({
    'string.min': 'Phone number must be at least {#limit} characters long',
    'string.max': 'Phone number must not exceed {#limit} characters',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be in a valid format',
    'any.required': 'Email is required',
  }),
});

module.exports = {
  userIdSchema,
  userSchema,
};
