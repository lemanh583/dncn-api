const express = require("express")
const cloudDinary = express.Router()
const uploadCtr = require("../../controller/upload")

cloudDinary
    .post("/upload", uploadCtr.upload)
    .post("/destroy", uploadCtr.destroy)

module.exports = cloudDinary