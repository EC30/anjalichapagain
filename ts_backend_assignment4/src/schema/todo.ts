import Joi from "joi";

export const getCreateTaskSchema = Joi.object({
  task: Joi.string().required().messages({
    "any.required": "Tasks is required",
    "string.empty": "Task cannot be empty",
  }),
});

export const getTaskQuerySchema = Joi.object({
  completed: Joi.boolean().messages({
    "boolean.base": "Completed should be boolean",
  }),
});