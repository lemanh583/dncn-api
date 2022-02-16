const express = require("express");
const route = express.Router();
const userCtr = require("../../controller/user");
const auth = require("../../middleware/auth");
const authAdmin = require("../../middleware/authAdmin");
const authMod = require("../../middleware/authMod");
const {
  validatorRegister,
  validatorLogin,
  checkUpdate
} = require("../../validater/userSchema");

route
  .post("/list", auth, authMod, userCtr.list)
  .get("/get/:id", auth, userCtr.get)
  .get("/get-token", auth, userCtr.getToken)
  .post("/create", validatorRegister, userCtr.create)
  .post("/login", validatorLogin, userCtr.login)
  .post("/update/:id", auth,checkUpdate ,userCtr.update)
  .delete("/delete-user/:id", auth, authAdmin, userCtr.deleteUser)
  .post("/ban-user/:id", auth, authMod, userCtr.banUser)
  .post("/change-pass/:id", auth, userCtr.changePass)
  .post("/change-role/:id", auth, authAdmin, userCtr.changeRole)

module.exports = route;
