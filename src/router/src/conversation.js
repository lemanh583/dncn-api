const express = require("express")
const router = express.Router()
const conversationCtr = require("../../controller/conversation")

router
    .post("/create", conversationCtr.create)
    .get("/list/:id", conversationCtr.list)
    .post("/update/:id", conversationCtr.update)
    // .get("/list", conversionCtr.list)

module.exports = router