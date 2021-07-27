const {Item, validate} = require('../models/item.model')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const {formatResult, validateObjectId} = require("../utils/import")



router.get("/:id", async (req, res) => {

  try {

    if (!validateObjectId(req.params.id)) {
      return res.send(formatResult({ status: 400, message: "Invalid id" }));
    }

    const item = await Item.findById(req.params.id);

    if (!item)
        return res.send(
        formatResult({ status: 404, message: "Item not found" })
    );

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

router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort("deadline");
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


router.post("/", async (req, res)=>{
    
    try {
        const { error } = validate(req.body);

        if (error) {
        return res.status(400).send(error.details[0].message);
        }

        let item = new Item({
            createdDate: new Date(Date.now()),
            updatedDate: new Date(Date.now()),
            deadline: req.body.deadline,
            task: req.body.task
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

router.put("/:id",async (req, res) => {
    try{

      if (!validateObjectId(req.params.id)){
        return res.send(formatResult({ status: 400, message: "Invalid id" }));
      }

      const { error } = validate(req.body);
      if (error) {
        return res.status(404).send(error.details[0].message);
      }

      const item = await Item.findByIdAndUpdate(
        req.params.id,
        {
          completedDate: req.body.isCompleted===true||req.body.isCompleted==="true" ? new Date(): null,
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

router.delete("/:id", async (req, res) => {
    try {
      if (!validateObjectId(req.params.id))
        return res.send(formatResult({ status: 400, message: "Invalid id" }));
      const item = await Item.findOneAndDelete({
        _id: req.params.id,
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
