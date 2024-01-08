import Joi from 'joi';

const schema={
  username: Joi.string().required().min(6).messages({
    "any.required": "Username is required",
    "string.empty": "Username cannot be empty",
    "string.min": "Username should have at least 6 characters",
    "string.base": "Username should be a string",
  }),
  fullname: Joi.string().required().regex(/^\S+ \S+$/).messages({
    "any.required": "Fullname is required",
    "string.empty": "Fullname cannot be empty",
    "string.pattern.base": "Fullname should consist of first and last name separated by a space",
    "string.base": "Fullname should be a string",
  }),
  email: Joi.string().required().email().messages({
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
    "string.email": "Invalid email format",
    "string.base": "Email should be a string",
  }),
  password: Joi.string().required().min(8)
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:\'",.<>/?]).{8,}$'))
  .messages({
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
    "string.min": "Password should have at least 8 characters",
    "string.pattern.base": "Password should be a combination of uppercase letters, lowercase letters, at least one special character, and at least one number",
    "string.base": "Password should be a string",
  }),
}

export const userSchema = Joi.object(schema);

export const updateUserSchema=Joi.object(schema).fork(Object.keys(schema), schema =>
schema.optional(),
);
