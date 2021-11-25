const userModel = require("../model/uses");
const authAdmin = async (req, res, next) => {
  try {
    const id = req.user_id;
    const find = await userModel.findById(id);
    if (!find) {
      return res
        .status(401)
        .send({ success: false, message: "Authentication failed" });
    } else {
      if (find.username == "admin" && find.email == "admin@admin.com") {
        next();
      } else {
        return res
          .status(401)
          .send({ success: false, message: "Authentication failed" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: fasle, message: error.message });
  }
};

module.exports = authAdmin;
