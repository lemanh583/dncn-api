const categoriesModel = require("../model/categories");
const postCtr = require("../controller/post")
class Categories {
  static async get(req, res) {
    try {
      const slug = req.params.slug;
      if (!slug)
        return res.status(500) .send({ success: false, message: "No id category" });
      const find = await categoriesModel.findOne({slug: slug});
      res.send({ success: true, data: find });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async list(req, res) {
    try {
      const list = await categoriesModel.find({})
                                        .sort({created_time: 1});
      res.send({ success: true, data: list });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const data = req.body;
      data.slug = postCtr.removeAccents(data.name, false)
      const find = await categoriesModel.findOne({$or: [{ name: data.name }, { slug: data.slug }]});
      if (find)
        return res.status(500).send({ success: false, message: "Category already exists" });
      const newCate = await categoriesModel.create(data);
      if (!newCate)
        return res.status(500).send({ success: false, message: "Create failed" });
      res.send({ success: true, data: newCate });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const data = req.body;
      const _id = req.params.id;
      if (!_id)
        return res
          .status(500)
          .send({ success: false, message: "No id category" });
      data.slug = postCtr.removeAccents(data.name, false)
      const findUp = await categoriesModel.findByIdAndUpdate(_id, data, {
        new: true,
      });
      if (!findUp)
        return res
          .status(500)
          .send({ success: false, message: "Update failed" });
      res.send({ success: true, data: findUp });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const _id = req.params.id;
      if (!_id)
        return res
          .status(500)
          .send({ success: false, message: "No id category" });
      const result = await categoriesModel.findByIdAndDelete({ _id });
      if (!result)
        return res
          .status(500)
          .send({ success: false, message: "Deleted failed" });
      res.send({ success: true, message: "Deleted completed" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }
}

module.exports = Categories;
