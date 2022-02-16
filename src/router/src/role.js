const express = require("express")
const router = express.Router()
const roleCtr = require("../../controller/role")
router.get("/list", roleCtr.list)

module.exports = router