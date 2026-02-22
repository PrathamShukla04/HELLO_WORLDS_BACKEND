const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateEditedProfileData } = require('../utils/validateSignupData');
const profileRouter = express.Router();
const bcrypt = require("bcryptjs")

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        validateEditedProfileData(req);
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];

        })
        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName} profile updated successfully`,
            data: loggedInUser,
        });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
})

profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            throw new Error("Password is required !!")
        }
        const passwordHash = await bcrypt.hash(password, 10);
        user.password = passwordHash;
        await user.save();
        res.send("Password updated successfully !!")
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
})

module.exports = profileRouter;