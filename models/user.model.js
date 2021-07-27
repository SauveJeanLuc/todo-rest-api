const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdDate: {
    type: Date,
  },
  updatedDate: {
    type: Date,
    default: null,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("jwtPrivateKey"));
  return token;
};
const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    userName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
