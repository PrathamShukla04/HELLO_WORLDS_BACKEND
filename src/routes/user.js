const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const express = require('express');
const userRouter = express.Router();

const User = require("../models/users");

const USER_SAFE_NAME = "firstName lastName profileurl age gender about skills"

userRouter.get("/user/request/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_NAME);

        res.json({
            message: "Data fetched successfully",
            data: connectionRequest,
        })

    } catch (err) {
        res.status(400).send({ error: err.message })
    }

});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const ConnectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "interested" },
                { toUserId: loggedInUser._id, status: "interested" },
            ],
        }).populate("fromUserId", USER_SAFE_NAME).populate("toUserId", USER_SAFE_NAME);

        const data = ConnectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.json(data);
    } catch (err) {
        res.status(400).send({ error: err.message })
    }

});

userRouter.post("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit=limit>50?50:limit;
        const skip = (page - 1) * limit;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id },
            ],
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();
        connectionRequests.forEach((row) => {
            hideUserFromFeed.add(row.fromUserId.toString());
            hideUserFromFeed.add(row.toUserId.toString());
        });
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ]
        }).select(USER_SAFE_NAME).skip(page).limit(limit);
        res.send(users);
    } catch (err) {
        res.status(400).send({ error: err.message })
    }

});

module.exports = userRouter;

