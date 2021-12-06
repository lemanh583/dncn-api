const express = require("express")
const postRoute = express.Router()
const postCtr = require("../../controller/post")

postRoute
    .get("/list", postCtr.list)
    .post("/create", postCtr.create)
    .get("/get/:slug", postCtr.get)
    .post("/update/:id", postCtr.update)
    .delete("/delete/:id", postCtr.delete)

module.exports = postRoute