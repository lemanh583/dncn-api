const express = require("express")
const router = express.Router()
const commentCtr = require("../../controller/comment")

router
    .post("/create", commentCtr.create)
    .post("/update/:id", commentCtr.update)
    .post("/list", commentCtr.list)
    .delete("/delete/:id", commentCtr.delete)


module.exports = router