const mongoose = require("mongoose")
const Schema = mongoose.Schema

const postSchema = new Schema ({
    title: {type: String, required: true, unique: true},
    slug: {type: String, required: true, unique: true},
    category: {type: Schema.Types.ObjectId, ref: "categories"},
    descriptions: String,
    content: String,
    author: {type: Schema.Types.ObjectId, ref: "users"},
    images: [{type: Schema.Types.ObjectId, ref: "images"}],
    view: {type: Number, default: 0},
    created_time: {type: Number, default: Date.now()},
    updated_time: {type: Number, default: Date.now()}
})

const posts = mongoose.model("posts", postSchema)
module.exports = posts