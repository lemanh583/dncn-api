const userModel = require("../model/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {validationResult} = require('express-validator')
const postModel = require("../model/posts")
const roleModel = require("../model/roles")
const uploadCtr = require("./upload")
const imgModel = require("../model/images")

class User {
  static async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }  
      const data = req.body;
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(data.password, salt);
      data.password = hashPass;
      const newUser = await userModel.create(data);
      if (!newUser)
        return res.status(500).send({ success: false, message: "create failed" });
      const token = jwt.sign(
        { id: newUser._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30d" }
      );
      return res.send({ success: true, data: newUser, token: token });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async login(req, res) {
    try {
      // console.log('req', req)
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }  
      const data = req.body;
      const find = await userModel.findOne({
        $or: [{ username: data.account }, { email: data.account }],
      });
      if (!find) {
        return res.status(500).send({ success: false, message: "Incorrect email or password. Please check again!" });
      }
      if(!find.active) {
        return res.status(500).send({ success: false, message: "Account has been blocked!" });
      }
      else 
      {
        const checkPass = await bcrypt.compareSync(data.password, find.password); // true
        if (checkPass) {
          const token = jwt.sign(
            { id: find._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "30d" }
          );
          return res.status(200).send({ success: true, token, message: "Login success!" });
        } else {
          return res.status(500).send({
            success: false,
            message: "Incorrect email or password. Please check again!",
          });
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async list(req, res) {
    try {
      // console.log(req.role)
      const skip = req.query.skip || 0;
      const limit = req.query.limit || 15;
      const {filter, search} = req.body
      const role = req.role
      let condition = {}
      User.mapFilter(condition, filter, search, role)
      console.log("______condition_______", condition)
      let list = await userModel
                            .find(condition)
                            .select('-password')
                            .sort({createdAt: -1})
                            .skip(Number(skip))
                            .limit(Number(limit));
      list = await Promise.all(
        list.map(async (value) => {
          let newData = Object.assign({}, value._doc)
          let countPost = await postModel.countDocuments({author: value._id})
          let permision = await roleModel.findOne({role: value.role})
          newData.countPost = countPost
          newData.permision = permision.name
          return newData
        })
      )
      const countUser = await userModel.countDocuments(condition)
      return res.send({ success: true, data: list, count: countUser });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static mapFilter (condition, filter, search, role) {
    if(search) {
      const searchRegex = new RegExp(`.*${search}.*`, 'i')
      condition['$or'] = [
        {username: searchRegex},
        {name: searchRegex},
        {email: searchRegex},
      ]  
    }
    if(role == 1) {
      condition.username = { $ne: "admin" }
      condition.email = { $ne: "admin@admin.com" }
    }
    if(!filter) return condition
    if(filter == "mod"){
      condition.role = 1
    }
    if(filter == "mem"){
      condition.role = 3
    }
    if(filter == "col"){
      condition.role = 2
    } 
    if(filter == "ban"){
      condition.active = false
    }
    return condition
  }

  static async get(req, res) {
    try {
      const _id = req.params.id;
      if (!_id)
        return res.status(500).send({ success: false, message: "no id" });
      const user = await userModel.findById(_id).populate({path: "img", select: "src"});
      if (!user)
        return res.status(500).send({ success: false, message: "not user" });
      return res.send({ success: true, data: user});
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async getToken(req, res) {
    try {
      const _id = req.user_id;
      if (!_id)
        return res.status(500).send({ success: false, message: "no id" });
      const user = await userModel.findById(_id)
                            .select('-password')
                            .populate({path: "img", select: "src"});
      if(!user.active) {
        return res.status(500).send({ success: false, message: "User has been blocked!" });
      }
      if (!user)
        return res.status(500).send({ success: false, message: "not user" });
      return res.send({ success: true, data: user });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async update (req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const data = req.body
      const _id = req.params.id
      const file = req.files
      if (!_id)
        return res.status(500).send({ success: false, message: "no id" })
      if(file) {
        console.log(file)
        const img = await uploadCtr.upload(file.file);
        data.img = img.img._id
      }
      
      const update = await userModel.findByIdAndUpdate(_id, data, {new: true})
      res.send({success: true, data: update})
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async deleteUser (req, res) {
    try {
      const _id =  req.params.id
      if (!_id)
        return res.status(500).send({ success: false, message: "no id" });
      const user = userModel.findOneAndDelete({_id, role: 3})
      if(!user)
        return res.status(500).send({ success: false, message: "Deleted failed!" });
      res.send({success: true, message: "Delete completed!"})
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async banUser (req, res) {
    try {
      const _id =  req.params.id
      const role = req.role
      const {flag} = req.body
      if(!flag)
        return res.status(500).send({ success: false, message: "no flag" });
      if (!_id)
        return res.status(500).send({ success: false, message: "no id" });
      let user = {}
      if(role == 1){
        if(flag == "ban"){
          user = await userModel.findOneAndUpdate({_id, role: {$in: [2,3]}}, {active: false})
        }
        else if(flag == "unban") {
          user = await userModel.findOneAndUpdate({_id, role: {$in: [2,3]}}, {active: true})
        }
      }
      if(role == 0){
        if(flag == "ban"){
          user = await userModel.findOneAndUpdate({_id, role: {$in: [1,2,3]}}, {active: false}, {new: true})
          // console.log('user', user)
        }
        else if(flag == "unban") {
          user =  await userModel.findOneAndUpdate({_id, role: {$in: [1,2,3]}}, {active: true})
        }
      }
      if(!user)  return res.status(500).send({ success: false, message: "failed!" });
      res.send({success: true, message: "Completed!"})

    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  } 

  static async changePass (req, res) {
    try {
      const id = req.params.id
      const data = req.body
      if (!id)
        return res.status(500).send({ success: false, message: "no id" })
      // console.log('data', data)
      if(data.password && data.password.length >= 5) {
        const salt = bcrypt.genSaltSync(10);
        const hashPass = bcrypt.hashSync(data.password, salt);
        data.password = hashPass;
      }else {
        return res.status(400).send({success: false, message: "Password not format"})
      }
      const result = await userModel.findByIdAndUpdate(id, data)
      return res.send({success: true, message:"success"})
    } catch (error) {
      console.error(error)
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async changeRole (req, res) {
    try {
      const id = req.params.id
      const {role} = req.body
      if(!id)  return res.status(400).send({success: false, message: "Not id"})
      const find = await userModel.findByIdAndUpdate(id, {role: role})
      if(!find) return res.status(400).send({success: false, message: "Not find user"})
      return res.send({success: true})
    } catch (error) {
      console.error(error)
      return res.status(500).send({ success: false, message: error.message });
    }
  }

}

module.exports = User;
