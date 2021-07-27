const auth = require('../middleware/auth')
const admin = require("../middleware/admin");
const {Item, validate} = require('../models/item.model')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const {formatResult, validateObjectId} = require("../utils/import")



router.get("/:id", auth, async (req, res) => {

  try {
    if (!validateObjectId(req.params.id)) {
      return res.send(formatResult({ status: 400, message: "Invalid id" }));
    }

    const item = await Item.findOne({ _id: req.params.id, userId: req.user._id});

    if (!item)
      return res.send(formatResult({ status: 404, message: "Item not found" }));

    res.send(item);
  } catch (err) {
    res.send(
      formatResult({
        status: 500,
        message: err,
      })
    );
  }

});

router.get("/", auth, async (req, res) => {
  try {
    // const items = await Item.find()
    console.log(req.user._id)
    const items = await Item.find({userId: req.user._id})   
    .sort("deadline");
    console.log("Items: " + items);
    res.send(items);
  } catch (err) {
    res.send(
      formatResult({
        status: 500,
        message: err,
      })
    );
  }
});


router.post("/", auth, async (req, res)=>{
    
    try {
        const { error } = validate(req.body);

        if (error) {
        return res.status(400).send(error.details[0].message);
        }

        let item = new Item({
            createdDate: new Date(Date.now()),
            updatedDate: new Date(Date.now()),
            deadline: req.body.deadline,
            task: req.body.task,
            userId: req.user._id, 
            isCompleted: false
        });

        item = await item.save();
        res.send(item);
    } catch (err) {
      res
        .send(
          formatResult({
            status: 500,
            message: err,
          })
        );
    }

})

router.put("/:id", auth, async (req, res) => {
    try{

      if (!validateObjectId(req.params.id)){
        return res.send(formatResult({ status: 400, message: "Invalid id" }));
      }

      const { error } = validate(req.body);
      if (error) {
        return res.status(404).send(error.details[0].message);
      }

      const item = await Item.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id},
        {
          completedDate:
            req.body.isCompleted === true || req.body.isCompleted === "true"
              ? new Date()
              : null,
          updatedDate: new Date(Date.now()),
          isCompleted: req.body.isCompleted,
          deadline: req.body.deadline,
          task: req.body.task,
        },
        { new: true, useFindAndModify: false }
      );

      if (!item) {
        return res.send(
          formatResult({ status: 404, message: "Item not found" })
        );
      }
      return res.send(
        formatResult({
            status: 200,
            message: "Item updated successfully",
            data: item,
        })
      );
    }catch(err){
        res.send(
            formatResult({
                status: 500,
                message: err
            })
        ); 
    }


});

router.delete("/:id", auth, async (req, res) => {
    try {
      if (!validateObjectId(req.params.id))
        return res.send(formatResult({ status: 400, message: "Invalid id" }));
      const item = await Item.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id
      });
      if (!item)
        return res.send(
          formatResult({ status: 404, message: "Item not found" })
        );
      return res.send(
        formatResult({ status: 200, message: "Item deleted successfully", data: item})
      );
    } catch (e) {
      res.send(formatResult({ status: 500, message: e }));
    }
});


module.exports = router;
