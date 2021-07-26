const mongoose = require('mongoose');
const Joi = require('joi');
const items = require('./routes/items');
const express = require('express');
const app = express();

//Connect to MongoDB
mongoose
    .connect("mongodb://localhost:27017/todo")
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err)=> console.error("Could not Connect to MongoDB"));


app.use(express.json());
app.use('/api/genres', genres);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));