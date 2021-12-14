const express = require("express");
const route = express.Router();
const userCtr = require("../../controller/user");
const auth = require("../../middleware/auth");
const authAdmin = require("../../middleware/authAdmin");
const authMod = require("../../middleware/authMod");
const {
  validatorRegister,
  validatorLogin,
} = require("../../validater/userSchema");

route
  .get("/list", auth, authMod, userCtr.list)
  .get("/get/:id", auth, userCtr.get)
  .get("/get-token", auth, userCtr.getToken)
  .post("/create", validatorRegister, userCtr.create)
  .post("/login", validatorLogin, userCtr.login)
  .post("/update/:id", auth, userCtr.update)
  .delete("/delete-user/:id", auth, authAdmin, userCtr.deleteUser)
  .post("/ban-user/:id", auth, authMod, userCtr.banUser)

module.exports = route;
