//import dependencies
const Joi = require("joi");
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const {formatResult} = require("../utils/import")
const {validateObjectId} = require("../utils/import");

//Create a Schema

const Item = mongoose.model(
  "Item",
  new mongoose.Schema({
    isCompleted: {
      type: Boolean, //Check
      // required: true,
      // default: false, //Check
    },
    createdDate: {
      type: Date
    },
    updatedDate: {
      type: Date
    },
    //   completionDate: {
    //       type: Date,
    //       //Auto Write if completed turns true, Else write null if isCompleted goes false
    //   },
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
    },
  })
);

// ************* CRUD OPERATIONS ******************//

// Get a single item by Id

router.get("/:id", async (req, res) => {
  const item = await Item.findById(req.params.id)

  if (!item) return res.status(404).send("The item with given Id is not found");
  res.send(item);
});

// Get All items in the list

router.get("/", async (req, res) => {
    console.log("Reached Here");
  const items = await Item.find().sort('deadline');
  res.send(items);
});

// Create an Item
router.post("/", async (req, res)=>{
    console.log("Reached Here POST")
    const { error } = validateItem(req.body);

    if (error){
        return res.status(400).send(error.details[0].message);
    }

    let item = new Item({
      //Set Auto complete dates
      createdDate: new Date(Date.now()),
      updatedDate: new Date(Date.now()),
      isCompleted: false,
      deadline: req.body.deadline,
      task: req.body.task,
    }); 

    item = await item.save();
    res.send(item);
})

// Edit an Item

router.put("/:id",async (req, res) => {
    console.log("Reached Here 1")

  //Validate Item
  const { error } = validateItem(req.body);
  if (error) {
    return res.status(404).send(error.details[0].message);
  }

    console.log("Reached Here 2");

    const item = await Item.findByIdAndUpdate(
      req.params.id,
      {
        updatedDate: new Date(Date.now()),
        isCompleted: req.body.isCompleted,
        deadline: req.body.deadline,
        task: req.body.task
      },
      { new: true, useFindAndModify: false }
    );
      
    console.log(req.body);

  if (!item) {
    return res.status(404).send("The item with the given ID was not found");
  }
  
  res.send(item);
});

//Delete an Item

router.delete("/:id", async (req, res) => {
    try {
      if (!validateObjectId(req.params.id))
        return res.send(formatResult({ status: 400, message: "Invalid id" }));
      const ItemId = await Item.findOneAndDelete({
        _id: req.params.id,
      });
      if (!ItemId)
        return res.send(
          formatResult({ status: 404, message: "Item not found" })
        );
      return res.send(
        formatResult({ status: 200, message: "Item deleted successfully" })
      );
    } catch (e) {
      res.send(formatResult({ status: 500, message: e }));
    }
});

//Function to validate an item
function validateItem(item) {
    const schema = Joi.object({
      isCompleted: Joi.boolean().truthy("true").falsy("false"),
      deadline: Joi.date().required(),
      task: Joi.string().required()
    });

    return schema.validate(item);
}



module.exports = router;
