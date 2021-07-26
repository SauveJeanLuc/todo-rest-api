//import dependencies
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const app = express();

app.use(express.json());

//Create a Schema

const Item = mongoose.model('Item', new mongoose.Schema({
  isCompleted: {
    type: Boolean, //Check
    required: true,
    default: false, //Check
  },
  creationDate: {
    type: Date,
    //Configure to be auto written
  },
  updationDate: {
    type: Date,
    //Configure to be auto written
  },
  completionDate: {
      type: Date,
      //Auto Write if completed turns true, Else write null if isCompleted goes false
  },
  targetDate:{
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
      maxlength: 255
  }
    }) 
);

// ************* CRUD OPERATIONS ******************//

// Get a single item by Id

app.get("/:id", async (req, res) => {
  const item = await Item.findById(req.params.id)

  if (!item) return res.status(404).send("The item with given Id is not found");
  res.send(item);
});

// Get All items in the list

router.get("/", async (req, res) => {
  const items = await Item.find().sort('targetDate');
  res.send(items);
});

// Create an Item
app.post("/",async (req, res)=>{

    const { error } = validateItem(req.body);

    if (error){
        return res.status(400).send(error.details[0].message);
    }

    let item = new Item({
        //Set Auto complete dates
        isCompleted: req.body.isCompleted,
        targetDate: req.body.targetDate,
        task: req.body.task
    }) 

    item = await item.save();
    res.send(item);
})

// Edit an Item

app.put("/:id",async (req, res) => {

  //Validate Item
  const { error } = validateItem(req.body);
  if (error) {
    return res.status(404).send(error.details[0].message);
  }

  const item = await Item.findOneAndUpdate(
    id,
    { new: true, useFindAndModify: false },
    {
        $set: {
          isCompleted: req.body.isCompleted,
          targetDate: req.body.targetDate
        },
    }
  );

  if (!item) {
    return res.status(404).send("The item with the given ID was not found");
  }
  
  res.send(item);
});

//Delete an Item

app.delete("/:id", async (req, res) => {

  const item = await Item.findByIdAndRemove(req.params.id);

  if (!item) {
    return res.status(404).send("The item with The given ID is not available");
  }

  //Return the same item
  res.send(item);
});

//Function to validate an item
function validateItem(item) {
    const schema = Joi.object({
      id: Joi.number(),
      completed: Joi.boolean().truthy("true").falsy("false"),
      date: Joi.date().required(),
      task: Joi.string().required(),
    });

    return schema.validate(item);
}



module.exports = router;
