const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const conversionSchema = new Schema(
  {
    members: [{type: Schema.Types.ObjectId, ref: "users"}],
    type: String, // private or group 
    name: String,
    sender_id: {type: Schema.Types.ObjectId, ref: "users"},
    sender_name: String,
    receiver_id: {type: Schema.Types.ObjectId, ref: "users"},
    receiver_name: String,
    last_message: {type: Schema.Types.ObjectId, ref: "messages"},
    created_time: {type: Number, default: Date.now},
    updated_time: {type: Number, default: Date.now}
  },
);

const conversation = mongoose.model("conversations", conversionSchema);
module.exports = conversation