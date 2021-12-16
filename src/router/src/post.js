const express = require("express")
const postRoute = express.Router()
const postCtr = require("../../controller/post")
const auth = require("../../middleware/auth")
const checkUpload = require("../../middleware/checkUpload")
const { validatorPostCreate } = require("../../validater/postSchema")

postRoute
    .get("/list", postCtr.list)
    .post("/create", auth, validatorPostCreate, checkUpload, postCtr.create)
    .get("/get/:slug", postCtr.get)
    .post("/update/:id", auth, postCtr.update)
    .delete("/delete/:id", auth, postCtr.delete)

module.exports = postRoute