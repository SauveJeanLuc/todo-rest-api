//Import Dependencies
const mongoose = require('mongoose');

//Connect to MongoDB
mongoose
    .connect("mongodb://localhost:27017/todo")
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err)=> console.error("Could not Connect to MongoDB"));

//Create a Schema
const itemSchema = new mongoose.Schema({
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
});

const Item = mongoose.model('Item', itemSchema);

// ************* CRUD OPERATIONS ******************//

// Get a single item by Id

async function getItemById(id){
    const item = await Item
        .findById(id)

    console.log(item);
}

// Get All items in the list

async function getAllItems(){
    const items = await Item
        .findAll();

    console.log(items);
}

// Create an Item

async function createItem(){
    const item = new Item({
      targetDate: "2021/08/05",
      task: "Submit internship assignment"
    });

    try{
        const result = await item.save();
        console.log(result) // Remove
    }
    catch(ex){
        for(field in ex.errors)
            console.log(ex.errors[field].message);
    }
}

// Edit an Item
async function updateItem(id){

    const item = Item.findOneAndUpdate(id, {new: true, useFindAndModify: false},{
        $set: {
            isCompleted: true,
            targetDate: "2021/09/05"
        }
    })

    console.log(item)
}

//Delete an Item

async function removeItem(id){

    const item = await Item.findByIdAndRemove(id);
    console.log(item)
}

//Function to run for test




//Port and listen to port
// const port = process.env.PORT || 3000;
// app.listen(port, () => console.log(`Listening on port ${port}`))