const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");
const authenticateToken = require("../middleware/authenticateToken");

const userRouter = express.Router();

userRouter.post("/login/", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await userModel.findOne({ email });
  if (existingUser === null) {
    res.status(400);
    res.send("User does not exists");
  } else {
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (matchPassword) {
      const id = existingUser._id.toString();
      const payload = { email, id };
      const jwtToken = jwt.sign(payload, process.env.SECRET_KEY);
      res.status(200);
      res.send({ jwtToken });
    } else {
      res.status(400);
      res.send("Incorrect password");
    }
  }
});

userRouter.post("/register/", async (req, res) => {
  const { email, password, notes } = req.body;
  const existingUser = await userModel.findOne({ email });
  if (existingUser !== null) {
    res.status(400);
    res.send("User already exists");
  } else {
    const hashedPassword = await bcrypt.hash(password, 6);
    const newUser = new userModel({ email, password: hashedPassword, notes });
    await newUser.save();
    res.status(200);
    res.send("User registered successfully");
  }
});

module.exports = userRouter;
