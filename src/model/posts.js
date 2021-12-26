const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: Schema.Types.ObjectId, ref: "categories" },
  descriptions: String,
  content: String,
  author: { type: Schema.Types.ObjectId, ref: "users" },
  image: { type: Schema.Types.ObjectId, ref: "images" },
  view: { type: Number, default: 0 },
  approved: { type: String, default: 0 },
  created_time: { type: Number, default: Date.now() },
  updated_time: { type: Number, default: Date.now() },
});

postSchema.pre("findOne", async function (done) {
  const record = await this.model.find(this.getQuery());
  // console.log('record', record)
  if (record.length != 0) {
    await this.model.findByIdAndUpdate(record[0]._id, {
      view: record[0].view + 1,
    });
  }
  done();
});

const posts = mongoose.model("posts", postSchema);
module.exports = posts;
