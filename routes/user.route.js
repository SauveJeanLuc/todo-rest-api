const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user.model");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const { formatResult, validateObjectId } = require("../utils/import");

router.get("/:id", async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.send(formatResult({ status: 400, message: "Invalid id" }));
    }

    const user = await User.findById(req.params.id);

    if (!user)
      return res.send(formatResult({ status: 404, message: "User not found" }));

    res.send(_.pick(user, ["userName", "email"]));
  } catch (err) {
    res.send(
      formatResult({
        status: 500,
        message: err,
      })
    );
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort("createdDate");
    res.send(_.pick(users, ["userName", "email"]));
  } catch (err) {
    res.send(
      formatResult({
        status: 500,
        message: err,
      })
    );
  }
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");

    user = new User({
      createdDate: new Date(Date.now()),
      updatedDate: new Date(Date.now()),
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user = await user.save();

    res.send(_.pick(user, ["userName", "email"]));
  } catch (err) {
    res.send(
      formatResult({
        status: 500,
        message: err,
      })
    );
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.send(formatResult({ status: 400, message: "Invalid id" }));
    }

    const { error } = validate(req.body);
    if (error) {
      return res.status(404).send(error.details[0].message);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        email: req.body.email,
        userName: req.body.userName,
        updatedDate: new Date(Date.now()),
      },
      { new: true, useFindAndModify: false }
    );

    if (!user) {
      return res.send(formatResult({ status: 404, message: "User not found" }));
    }
    return res.send(
      formatResult({
        status: 200,
        message: "User updated successfully",
        data: _.pick(user, ["userName", "email"]),
      })
    );
  } catch (err) {
    res.send(
      formatResult({
        status: 500,
        message: err,
      })
    );
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!validateObjectId(req.params.id))
      return res.send(formatResult({ status: 400, message: "Invalid id" }));
    const user = await User.findOneAndDelete({
      _id: req.params.id,
    });
    if (!user)
      return res.send(formatResult({ status: 404, message: "User not found" }));
    return res.send(
      formatResult({
        status: 200,
        message: "User deleted successfully",
        data: user,
      })
    );
  } catch (e) {
    res.send(formatResult({ status: 500, message: e }));
  }
});

module.exports = router;
