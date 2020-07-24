const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const authentication = require("../middleware/authentication");
const router = express.Router();

// Create a User
router.post("/users", async (req, res) => {
  try {
    const duplicate = await User.findOne({ email: req.body.email });
    if (duplicate) {
      return res.status(400).send();
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    await user.generateAuthToken();
    res.status(201).send(user);
  } catch (error) {
    res.status(500).send();
  }
});

// Login the user
router.post("/users/login", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).send("Invalid email or password");
    }
    if (!(await bcrypt.compare(userPassword, user.password))) {
      return res.status(400).send("Invalid email or password");
    }
    await user.generateAuthToken();
    res.send({ user: user, message: "You have been logged in!" });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Logout from current device
router.get("/users/logout", authentication, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send("user not found");
    }
    user.tokens.pop();
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Logout from all devices
router.get("/users/logout/all", authentication, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).send("user not found");
    }
    user.tokens.splice(0, user.tokens.length);
    await user.save();
    res.send({
      user: user,
      message: "You have been logged out from all devices",
    });
  } catch (error) {
    res.status(500).send();
  }
});

// Get a user
router.get("/users/me", authentication, async (req, res) => {
  res.send(req.user);
});

// Edit user
router.patch("/users/me", authentication, async (req, res) => {
  const allowedUpdates = ["name", "email", "password"];
  const updates = Object.keys(req.body);
  updates.forEach((update) => {
    if (!allowedUpdates.includes(update)) {
      return res.status(400).send("update not allowed");
    }
  });
  try {
    const user = req.user;
    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete user
router.delete("/users/me", authentication, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
