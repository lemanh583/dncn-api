const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imagesSchema = new Schema({
  public_id: {type: String, required: true},
  src: {type: String, required: true},
  descriptions: String,
  created_time: { type: Number, default: Date.now() },
  updated_time: { type: Number, default: Date.now() },
});

const images = mongoose.model("images", imagesSchema);
module.exports = images ;
