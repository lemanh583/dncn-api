const express = require("express")
const cloud = express.Router()
const uploadCtr = require("../../controller/upload")

cloud
    .post("/google-upload", uploadCtr.googleUpload)
    .post("/google-destroy", uploadCtr.destroy)

module.exports = cloud