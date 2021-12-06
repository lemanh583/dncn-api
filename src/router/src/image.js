const express = require("express")
const imgRoute = express.Router()
const imgCtr = require("../../controller/image")

imgRoute
    .post("/create", imgCtr.create)
    .get("/get", imgCtr.get)
    .delete("/delete/:id", imgCtr.delete)

module.exports = imgRoute