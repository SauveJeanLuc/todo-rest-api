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
// app.get("/api/items/:id", (req, res)=>{
//     const item = items.find( (c)=> c.id === parseInt(req.params.id));

//     if (!item) 
//         return res.status(404).send('The item with given Id is not found')
//     res.send(item);

// });

async function getItemById(id){
    const item = await Item
        .find({id: id})

    console.log(item);
}

// Get All items in the list
// app.get("/api/items/", (req, res)=>{
//     res.send(items);
// })

// Create an Item
app.post("/api/items", (req, res)=>{

    const { error } = validateItem(req.body);

    if (error){
        return res.status(400).send(error.details[0].message);
    }

    const item = {
        id: items.length + 1,
        completed: req.body.completed,
        date: req.body.date,
        task: req.body.task
    }

    items.push(item);
    res.send(item);
})

// Edit an Item
app.put("/api/items/:id", (req,res)=>{

    //Check if Item Exists

    const item = items.find((c) => c.id === parseInt(req.params.id));
    if(!item){
        return res.status(404).send("The item with the given ID was not found");
    }
    //Validate Item

    const { error } = validateItem(req.body)
    if(error){
        return res.status(404).send(error.details[0].message);
    }
    //Update Item
    item.completed = req.body.completed;
    item.date = req.body.date;
    item.task = req.body.task;
    //Return Item
    res.send(item)
})

//Delete an Item
app.delete('/api/items/:id', (req,res)=>{
    //Check if Item exists
    const item = items.find( (c) => c.id === parseInt(req.params.id));
    if(!item) {
        return res.status(404).send('The item with The given ID is not available')
    }

    const index = items.indexOf(item);
    items.splice(index, 1);
    //Return the same item
    res.send(item);
})


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



//Port and listen to port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`))