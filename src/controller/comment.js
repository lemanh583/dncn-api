const commentModel = require("../model/comments")
class Comment {
  static async list(req, res) {
    try {
      const {filter } = req.body
      let condition = {}
      if(filter) {
        if(filter.author) {
          condition.author = filter.author
        }
        if(filter.post) {
          condition.post = filter.post
        }
      }
      const list = await commentModel.find(condition)
      return res.send({success: true, data: list})
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }
  static async update(req, res) {
    try {
      const id = req.params.id
      const data = req.body
      if(!id)
        return res.status(500).send({success: false, message: "No id"})
      let result = await commentModel.findByIdAndUpdate(id, data, {new: true})
      return res.send({success: true, data: result})
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }
  static async delete(req, res) {
    try {
      const id = req.params.id
      if(!id)
        return res.status(500).send({success: false, message: "No id"})
      let result = await commentModel.findByIdAndDelete(id)
      if(!result)
        return res.status(500).send({success: false, message: "No id"})
      return res.send({success: true, message: "success"})
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }
  static async create(req, res) {
    try {
      const data = req.body
      const userid = req.user_id
      data.author = userid
      let result = await commentModel.create(data)
      return res.send({success: true, data: result})
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }
}

module.exports = Comment;
