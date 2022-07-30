const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    sender_id: {type: Schema.Types.ObjectId, ref: "users"},
    sender_name: String,
    conversion_id: {type: Schema.Types.ObjectId, ref: "conversations"},
    receiver_id: {type: Schema.Types.ObjectId, ref: "users"},
    message: String,
    type: String,
    created_time: {type: Number, default: Date.now },
    updated_time: {type: Number, default: Date.now }
  },
);

const messages = mongoose.model("messages", messageSchema);
module.exports = messages