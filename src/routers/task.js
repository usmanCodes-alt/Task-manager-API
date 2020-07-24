const express = require("express");
const Task = require("../models/taskModel");
const authentication = require("../middleware/authentication");
const router = express.Router();

router.post("/users/createtask", authentication, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      ownerId: req.userId,
    });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// view task
router.get("/users/mytasks/:id", authentication, async (req, res) => {
  try {
    const taskId = req.params.id.replace("id=", "");
    const task = await Task.findOne({ _id: taskId, ownerId: req.userId });
    if (!task) {
      return res.status(404).send("task not found");
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// View all tasks
router.get("/users/mytasks", authentication, async (req, res) => {
  try {
    const tasks = await Task.find({ ownerId: req.userId });
    if (!tasks) {
      return res.status(404).send("No tasks found");
    }
    res.send(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

// update task
router.patch("/users/mytasks/:id", authentication, async (req, res) => {
  const allowedUpdates = ["name", "isComplete", "deadline"];
  const updates = Object.keys(req.body);
  updates.forEach((update) => {
    if (!allowedUpdates.includes(update)) {
      return res.status(400).send("updates not allowed");
    }
  });
  try {
    const taskId = req.params.id.replace("id=", "");
    const task = await Task.findOne({ _id: taskId, ownerId: req.userId });
    if (!task) {
      return res.status(404).send("task not found");
    }
    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete task
router.delete("/users/mytasks/:id", authentication, async (req, res) => {
  try {
    const taskId = req.params.id.replace("id=", "");
    const task = await Task.findOneAndRemove({
      _id: taskId,
      ownerId: req.userId,
    });
    if (!task) {
      return res.status(404).send("task not found");
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
