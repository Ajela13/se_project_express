const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "string.empty": 'The "weather" field must be filled in',
      "any.required": "The weather field is required.",
    }),
  }),
});

module.exports.validateUserCreated = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.empty": "The name field cannot be empty.",
      "string.min": "The name must be at least 2 characters long.",
      "string.max": "The name cannot exceed 30 characters.",
      "any.required": "The name field is required.",
    }),
    avatar: Joi.string().required().uri().messages({
      "string.empty": "The image URL field cannot be empty.",
      "string.uri": "The image URL must be a valid URL.",
      "any.required": "The image URL field is required.",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "The email field cannot be empty.",
      "any.required": "The image URL field is required.",
    }),
    password: Joi.string().required().messages({
      "string.empty": "The password field cannot be empty.",
      "any.required": "The image URL field is required.",
    }),
  }),
});

module.exports.validateUserLoggedIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": "The email field cannot be empty.",
      "any.required": "The image URL field is required.",
    }),
    password: Joi.string().required().messages({
      "string.empty": "The password field cannot be empty.",
      "any.required": "The image URL field is required.",
    }),
  }),
});

module.exports.validateUserAndClothingId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required().messages({
      "string.empty": "The ID field cannot be empty.",
      "string.length": "The ID must be 24 characters long.",
      "string.hex": "The ID must be a valid hexadecimal value.",
      "any.required": "The ID field is required.",
    }),
  }),
});
