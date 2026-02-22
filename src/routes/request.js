// const express = require('express');
// const requestRouter = express.Router();
// const { userAuth } = require('../middlewares/auth');
// const ConnectionRequest = require('../models/connectionRequest');

// requestRouter.post(
//   "/request/send/:status/:toUserId",
//   userAuth,
//   async (req, res) => {
//     try {
//       const fromUserId = req.user._id;
//       const toUserId = req.params.toUserId;
//       const status = req.params.status;

//       const allowedStatus = ["ignored", "interested"];
//       if (!allowedStatus.includes(status)) {
//         return res.status(400).json({
//           message: "Invalid status type " + status,
//         });
//       }

//       const toUser = await User.findById(toUserId);
//       if(!toUser) {
//         return res.status(404).send("User not found !!")
//       }

//       // ✅ Check if request already exists (both directions)
//       const existingConnectionRequest =
//         await ConnectionRequest.findOne({
//           $or: [
//             { fromUserId, toUserId },
//             { fromUserId: toUserId, toUserId: fromUserId },
//           ],
//         });

//       if (existingConnectionRequest) {
//         return res
//           .status(400)
//           .send("Connection request already exists between these users!");
//       }

//       // ✅ Create new request
//       const newConnectionRequest = new ConnectionRequest({
//         fromUserId,
//         toUserId,
//         status,
//       });

//       await newConnectionRequest.save();

//       res.send("Connection request sent successfully");
//     } catch (err) {
//       res.status(400).send("ERROR: " + err.message);
//     }
//   }
// );

// requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
//     try{
//         const loggedInUser = req.user;
//         const {status, requestId} = req.params;
//         const allowedStatus = ["accepted", "rejected"];
//         if(!allowedStatus.includes(status)) {
//             return res.status(400).json({message : "status not allowed"})
//         }
//         const connectionRequest = await ConnectionRequest.findOne({
//             _id:requestId,
//             toUserId:loggedInUser._id,
//             status:"interested",
//         });
//         if(!connectionRequest) {
//             return res.status(404).send("Connection request not found !!")
//         }   
//         connectionRequest.status=status;
//         const data = await connectionRequest.save();
//         res.json({message :"Connection Request "+status,data});
//     }catch(err){
//         res.status(404).send("ERROR: " + err.message);
//     }
// })


// module.exports = requestRouter;


const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/users'); // ✅ added

// ================= SEND REQUEST =================
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { status, toUserId } = req.params;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type " + status,
        });
      }

      // ❌ Prevent sending request to yourself
      if (fromUserId.toString() === toUserId) {
        return res.status(400).send("You cannot send request to yourself");
      }

      // ✅ Check if user exists
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).send("User not found!");
      }

      // ✅ Check if request already exists (both directions)
      const existingConnectionRequest =
        await ConnectionRequest.findOne({
          $or: [
            { fromUserId, toUserId },
            { fromUserId: toUserId, toUserId: fromUserId },
          ],
        });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send("Connection request already exists between these users!");
      }

      const newConnectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await newConnectionRequest.save();

      res.send("Connection request sent successfully");
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

// ================= REVIEW REQUEST =================
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Status not allowed",
        });
      }

      const connectionRequest =
        await ConnectionRequest.findOne({
          _id: requestId,
          toUserId: loggedInUser._id,
          status: "interested",
        });

      if (!connectionRequest) {
        return res
          .status(404)
          .send("Connection request not found!");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({
        message: "Connection Request " + status,
        data,
      });

    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
