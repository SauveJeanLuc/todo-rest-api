const Joi = require("joi");
const mongoose = require("mongoose");



const Item = mongoose.model(
  "Item",
  new mongoose.Schema({
    isCompleted: {
      type: Boolean,
      default: false,
      required: true
    },
    createdDate: {
      type: Date
    },
    updatedDate: {
      type: Date
    },
    completedDate: {
      type: Date,
      default: null
    },
    deadline: {
      type: Date,
      required: true
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


function validateItem(item) {
    const schema = Joi.object({
      isCompleted: Joi.boolean().truthy("true").falsy("false").required(),
      deadline: Joi.date()
        .min("now")
        .max(
          new Date(
            new Date().getFullYear() + 1,
            new Date().getMonth(),
            new Date().getDate()
          )
        )
        .required(),
      task: Joi.string().required(),
    });

    return schema.validate(item);
}

module.exports.Item = Item;
module.exports.validate = validateItem;