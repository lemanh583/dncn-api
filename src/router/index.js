const express = require("express")
const app = express()
const auth = require("../middleware/auth")

app.use("/api/user", require("./src/user"))
app.use("/api/category", require("./src/category"))
app.use("/api/cloud", auth, require("./src/upload"))
app.use("/api/image", require("./src/image"))
app.use("/api/post", require("./src/post"))
app.use("/api/comment", require("./src/comment"))
app.use("/api/role", require("./src/role"))
app.use("/api/dashboard", require("./src/dashboard"))
app.use("/api/conversation", require("./src/conversation"))

module.exports = app