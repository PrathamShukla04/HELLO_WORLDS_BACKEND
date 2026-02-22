const mongoose = require ("mongoose");

const connectionRequestSchema =new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    toUserId:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"user",
     required:true,   
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored","interested","accepted","rejected"], 
            message:`{VALUE} is incorrected status type`
        },
    },
},{
    timestamps:true,
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;