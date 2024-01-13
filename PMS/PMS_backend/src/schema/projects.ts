import Joi from 'joi';
// const Joi = require('joi')
//     .extend(require('@joi/date'));

const schema={
  name: Joi.string().required().min(4).messages({
    "any.required": "Project name is required",
    "string.empty": "Project name cannot be empty",
    "string.min": "Project name should have at least 4 characters",
    "string.base": "Project name should be a string",
  }),
  description: Joi.string().required().min(10).messages({
    "any.required": "Description is required",
    "string.empty": "Description cannot be empty",
    "string.min": "Description should have at least 10 characters",
    "string.base": "Description should be a string",
  }),
  deadline: Joi.date().required().messages({
    "any.required": "Deadline is required",
    "date.base": "Deadline should be a valid date",
  }),
  status: Joi.boolean().messages({
    "boolean.base": "Status should be a boolean",
  }),
  image: Joi.string()
  .allow(null, '')
  .optional()
  .pattern(/.(jpg|jpeg|png|gif)$/i)
  .messages({
    "string.base": "Image should be a string",
    "string.pattern.base": "Invalid image file format",
  }),
  priority: Joi.string().valid('High', 'Medium', 'Low').optional().messages({
    "any.only": "Priority should be one of 'High', 'Medium', 'Low'",
  }),
}
export const projectSchema = Joi.object(schema);

export const updateprojectSchema=Joi.object(schema).fork(Object.keys(schema), schema =>
schema.optional(),
);

