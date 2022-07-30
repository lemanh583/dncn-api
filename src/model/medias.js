const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mediaSchema = new Schema({
  web_content_link: String,
  web_view_link: String,
  src: {type: String, required: true},
  type: String,
  descriptions: String,
  size: Number,
  created_by: {type: Schema.Types.ObjectId, ref: "users"},
  created_time: { type: Number, default: Date.now },
  updated_time: { type: Number, default: Date.now },
});

const medias = mongoose.model("medias", mediaSchema);
module.exports = medias ;
