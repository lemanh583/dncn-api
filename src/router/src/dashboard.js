const express = require("express")
const router = express.Router()
const dashboardCtr =  require("../../controller/dashboard")

router.get("/get", dashboardCtr.get)

module.exports = router