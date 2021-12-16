const postModel = require("../model/posts")
const userModel = require("../model/users")
const uploadCtr = require("./upload")
const imgModel = require("../model/images")
const {validationResult} = require('express-validator')

class Post {
  static async get(req, res) {
    try {
      const slug = req.params.slug
      const post = await postModel.findOne({slug: slug})
                                  .populate({path: 'category', select: 'name slug'})
                                  .populate({path: 'author', select: 'name username email'})                           
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
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const data = req.body
      const uid = req.user_id
      // console.log('reqs', req.files)
      const file = req.files
      const find = await userModel.findById(uid)
      if(!find)
        return res.status(400).send({success: false, message: "Not find user"})
      data.author = uid
      const slug = Post.removeAccents(data.title, true)
      data.slug = slug
      if(file) {
        // console.log('file', file)
        const upload = await uploadCtr.upload(file.file);
        const img = await imgModel.create(upload)
        data.image = img._id
      }
      const result = await postModel.create(data)
      return res.send({success: true, data: result})
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async list(req, res) {
    try {
      const {skip, limit, search, sort} = req.query
      const {filter} = req.body
      let condition = {}
      Post.mapFilter(condition, search, filter)
      const result = await postModel.find(condition)
                                    .populate({path: "category", select: "name"})
                                    .populate({path: "author", select: "name"})
                                    .pupulate({path: "image", select: "src"})
                                    .sort(sort || {created_time: -1})
                                    .skip(Number(skip) || 0)
                                    .limit(Number(limit) || 20)
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

  static removeAccents(str, flag) {
    str = str.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd').replace(/Đ/g, 'D')
              .toLowerCase()
              .replace(/[:"'*`,.^$]/g, "")
              .replace(/\s/g, "-")
    str = flag ? str + "-" + Date.now() + '.html' : str + ""
    return str
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
