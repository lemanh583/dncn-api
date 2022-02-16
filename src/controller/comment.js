const commentModel = require("../model/comments")
class Comment {
  static async list(req, res) {
    try {
      const {filter } = req.body
      const {skip, limit} = req.query
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
                                      .populate({
                                              path: 'author', 
                                              select: '-password',
                                              populate: "img"
                                            })
                                      .skip(Number(skip) || 0)
                                      .limit(Number(limit) || 10)
      const count = await commentModel.countDocuments(condition)
      return res.send({success: true, data: list, count})
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
      let result = await commentModel.create(data)
      return res.send({success: true, data: result})
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }
}

module.exports = Comment;
