const Joi = require("joi");
const mongoose = require("mongoose");


const User = mongoose.model(
  "User",
  new mongoose.Schema({
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      unique: true,
      required
    },
    password:{
        type: String,
        required: true
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
    userName: Joi.String().require(),
    email: Joi.Email().required()
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;