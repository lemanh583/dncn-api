const conversionModel = require("../model/conversations");

class Conversation {
  static async create(req, res) {
    try {
      const data = req.body;
      if (data.members.length == 0 || !data.type)
        return res.status(500).send({ success: false, message: "Please check field" });

      if (data.members.length == 2 && data.type == "private") {
        let condition = {
          members: {
            $in: data.members,
          },
          type: "private",
        };
        let existConversation = await conversionModel
          .findOne(condition)
          .populate({ path: "last_message", populate: { path: "sender_id" } });
        if (existConversation) {
          return res.status(200).send({ success: true, data: existConversation, exists: true });
        }
      }

      const conversation = await conversionModel.create(data).then((rs) => {
        rs.populate({ path: "last_message", populate: { path: "sender_id" } }).execPopulate();
      });

      return res.send({ success: true, data: conversation });
    } catch (error) {
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async list(req, res) {
    try {
      const data = req.body;
      let condition = Conversation.mapCondition(data);
      const result = await conversionModel
        .find(condition)
        .sort(data.sort || { updated_time: -1 })
        .populate({ path: "last_message", populate: { path: "sender_id" } });
      return res.send({ success: true, data: result });
    } catch (error) {
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async mapCondition(data) {
    let condition = {};
    if (data.id) {
      condition.members = { $in: [id] };
    }
    if (data.search) {
      let searchReg = new RegExp(`.*${data.search}.*`, "i");
      condition["$or"] = [
        { name: searchReg },
        { sender_name: searchReg },
        { receiver_name: searchReg },
      ];
    }
    return condition;
  }

  static async update(req, res) {
    try {
      const id = req.params.id; //id conversation
      const data = req.body;
      if (!id) return res.status(500).send({ success: false, message: "no id" });
      const result = await conversionModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!result) return res.status(500).send({ success: false, message: "no conversion" });
      return res.send({ success: true, data: result });
    } catch (error) {
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async get(req, res) {
    try {
    } catch (error) {
      return res.status(500).send({ success: false, message: error.message });
    }
  }
}

module.exports = Conversation;
