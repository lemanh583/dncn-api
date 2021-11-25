const mongoose = require("mongoose")
const Schema = mongoose.Schema

const commentSchema = new Schema ({
    name: String,
    post: {type: Schema.Types.ObjectId, ref: "posts"},
    author: {type: Schema.Types.ObjectId, ref: "users"},
    created_time: { type: Number, default: Date.now() },
    updated_time: { type: Number, default: Date.now() },
})

const comments = mongoose.model("comments", commentSchema)
module.exports = comments