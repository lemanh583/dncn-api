const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  name: String,
  role: { type: Number, default: 3 },
  descriptions: String,
  created_time: { type: Number, default: Date.now() },
  updated_time: { type: Number, default: Date.now() },
});

const roles = mongoose.model("roles", roleSchema);
module.exports =  roles ;
