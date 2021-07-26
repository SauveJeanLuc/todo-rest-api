const Joi = require("joi");
const mongoose = require("mongoose");

const Item = mongoose.model(
  "Item",
  new mongoose.Schema({
    isCompleted: {
      type: Boolean,
      default: false
    },
    createdDate: {
      type: Date,
    },
    updatedDate: {
      type: Date,
    },
    completionDate: {
      type: Date,
      default: null
    },
    deadline: {
      type: Date,
      required: true,
      //Default, tomorrow
      //Past can't be set
      //Maximum, one year
    },
    task: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
      unique: true
    },
  })
);

//Function to validate an item
function validateItem(item) {
    const schema = Joi.object({
      isCompleted: Joi.boolean().truthy("true").falsy("false"),
      deadline: Joi.date().min(Date.now).required(),
      task: Joi.string().required()
    });

    return schema.validate(item);
}

module.exports.Item = Item;
module.exports.validate = validateItem;