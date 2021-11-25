const express = require("express")
const app = express()

app.use("/api/user", require("./user"))
app.use("/api/category", require("./category"))


module.exports = app