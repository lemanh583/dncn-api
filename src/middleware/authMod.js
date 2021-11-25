const userModel = require("../model/uses");

const authMod = async (req, res, next) => {
  try {
    const id = req.user_id;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(401).send({ success: false, message: "Authentication failed" });
    } else {
      if (user.role == 1 || user.role == 0) {
        req.role = user.role
        next();
      } else {
        return res.status(401).send({ success: false, message: "Authentication failed" });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = authMod;
