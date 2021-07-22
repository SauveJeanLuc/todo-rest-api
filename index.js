//Imprt Dependencies
const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());


//Database

const items =[
    { id: 1, completed: true, date: "2021-07-22", task: "Complete Restful API using Express" },
    { id: 2, completed: false, date: "2021-07-23", task: "CRUD with Mongoose" },
    { id: 3, completed: false, date: "2021-07-24", task: "Authentication and Authorization" }
]

// ************* CRUD OPERATIONS ******************//

// Get a single item by Id
app.get("/api/items/:id", (req, res)=>{
    const item = items.find( (c)=> c.id === parseInt(req.params.id));

    if (!item) 
        return res.status(404).send('The item with given Id is not found')
    res.send(item);

});

// Get All items in the list
app.get("/api/items/", (req, res)=>{
    res.send(items);
})

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
        task: req.body.date
    }

    items.push(item);
    res.send(item)
    
})


//Function to validate an item
function validateItem(item) {
    const schema = Joi.object({
        id: Joi.number(),
        completed: Joi.boolean().required(),
        date: Joi.date().required(),
        task: Joi.string().required()
    })

    return schema.validate(item);
}


//Port and listen to port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`))