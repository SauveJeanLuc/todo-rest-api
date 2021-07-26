const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User} = require("../models/user.model");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const { formatResult, validateObjectId } = require("../utils/import");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
      return res.status(400).send("Invalid email or password");
    
    const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));

    res.send(token)

  } catch (err) {
    res.send(
      formatResult({
        status: 500,
        message: err,
      })
    );
  }
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(50).email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(req);
}

module.exports = router;