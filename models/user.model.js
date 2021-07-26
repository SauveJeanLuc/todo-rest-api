const Joi = require("joi");
const mongoose = require("mongoose");


const User = mongoose.model(
  "User",
  new mongoose.Schema({
    userName: {
      type: String,
      unique: true,
      required: true,
      minlength: 3,
      maxlength: 50
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password:{
        type: String,
        required: true,
        minlength: 5
    },
    createdDate: {
      type: Date,
    },
    updatedDate: {
      type: Date,
      default: null,
    }
  })
);

function validateUser(user) {
  const schema = Joi.object({
    userName: Joi.String().min(3).max(50).required(),
    email: Joi.email().required(),
    password: Joi.string().required()
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;