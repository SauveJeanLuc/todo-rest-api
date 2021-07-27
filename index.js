const config = require('config')
const mongoose = require('mongoose');
const items = require('./routes/item.route');
const users = require('./routes/user.route');
const auth = require('./routes/auth.route');
const express = require('express');
const app = express();


if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

//Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/todo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not Connect to MongoDB"));


app.use(express.json());
app.use('/api/items', items);
app.use('/api/users', users);
app.use('/api/auth',auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));