const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true },
  descriptions: String,
  slug: String,
  created_time: { type: Number, default: Date.now() },
  updated_time: { type: Number, default: Date.now() },
});

const categories = mongoose.model("categories", categorySchema);
module.exports = categories;
