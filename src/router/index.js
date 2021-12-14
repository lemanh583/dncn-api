const express = require("express")
const app = express()
const auth = require("../middleware/auth")

app.use("/api/user", require("./src/user"))
app.use("/api/category", require("./src/category"))
// app.use("/api/cloud",auth, require("./src/upload"))
app.use("/api/image", require("./src/image"))
app.use("/api/post", require("./src/post"))

module.exports = app