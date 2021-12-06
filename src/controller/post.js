const postModel = require("../model/posts")
const userModel = require("../model/users")
class Post {
  static async get(req, res) {
    try {
      const slug = req.params.slug
      const post = await postModel.findOne({slug: slug})
                                  .populate({path: 'category', select: 'name'})
                                  .populate({path: 'author', select: 'name username email'})
                                  .populate('images')
      if(!post)
        return res.status(400).send({success: false, message: "Not find post!"})
      return res.send({success: true, data: post})
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const data = req.body
      const uid = req.user_id
      const find = await userModel.findById(uid)
      if(!find)
        return res.status(400).send({success: false, message: "Not find user"})
      data.author = uid
      const result = await postModel.create(data)
      return res.send({success: true, data: result})
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async list(req, res) {
    try {
      const {skip, limit, search} = req.query
      const {filter} = req.body
      let condition = {}
      Post.mapFilter(condition, search, filter)
      const result = await postModel.find(condition)
                                    .sort(sort || {created_time: -1})
                                    .skip(Number(skip))
                                    .limit(Number(limit))
      const count = await postModel.countDocuments(condition)
      return res.send({success: true, data: result, count})
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async update(req, res) {
    try {
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async delete(req, res) {
    try {
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static mapFilter (condition, search, filter) {
    if(search) {
      const searchRegex = new RegExp(`.*${search}.*`, 'i')
      condition['$or'] = [
        { title: searchRegex },
        { descriptions: searchRegex}
      ]
    }
    if(!filter) return condition
    if(filter.category) {
     condition.category = filter.category 
    }
    if(filter.uid) {
      condition.uid = filter.uid
    }
    return condition
  }

}

module.exports = Post;
