const express = require("express");
const categoryRouter = express.Router();
const categoryCtr = require("../../controller/category");

categoryRouter
  .get("/get/:slug", categoryCtr.get)
  .get("/list", categoryCtr.list)
  .post("/create", categoryCtr.create)
  .post("/update/:id", categoryCtr.update)
  .delete("/delete/:id", categoryCtr.delete);

module.exports = categoryRouter;
