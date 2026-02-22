const express = require('express');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const { validateSignupData } = require('../utils/validateSignupData');

const authRouter = express.Router();

/* ---------- SIGNUP ---------- */
authRouter.post('/signup', async (req, res) => {
  try {
    validateSignupData(req);

    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 3600000)
    })

    res.json({
      message: "User registered successfully",
      data: savedUser
    })
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ---------- LOGIN ---------- */
authRouter.post("/login", async (req, res) => {
  try {

    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      if (!user) {
        return res.status(404).send("User not found !!");
      }

    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Successfull !!")
    } else {
      throw new Error("Invalid Credentials !!")
    }

  } catch (err) {
    res.status(404).send("Error :" + err.message);
  }
});

/* ---------- LOGOUT ---------- */
authRouter.post('/logout', (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successfull !!")
});

module.exports = authRouter;
