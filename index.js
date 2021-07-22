//Imprt Dependencies
const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());


//Database

const items =[
    { id: 1, completed: false, date: "2020-08-34", task: "" },
    { id: 2, completed: true, date: "2021-09-12", task: "" },
    { id: 3, completed: true, date: "2021-07-13", task: "" }
]

// ************* CRUD OPERATIONS ******************//

// Get a single item by Id
app.get("/api/items/:id", (req, res)=>{
    const item = items.find( (c)=> c.id === parseInt(req.params.id));

    if (!item) 
        return res.status(404).send('The item with given Id is not found')
    res.send(course);
    
});
