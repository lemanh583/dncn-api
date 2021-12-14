const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    role: {type: Number, default: 3},
    note: String,
    date: String,
    phone: String,
    active: {type: Boolean, default: true},
    img: {type: Schema.Types.ObjectId, ref: "images"},
    created_time: {type: Number, default: Date.now()},
    updated_time: {type: Number, default: Date.now()}
  },
);

const users = mongoose.model("users", userSchema);
module.exports = users
