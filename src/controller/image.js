const UploadCtr = require("./upload")
const imageModel = require("../model/images")

class Image {

  static async create(req, res) {
    try {
      
      const file = req.files.upload
      // console.log('file', file)
      let result = null
      if(Array.isArray(file)) {
        result = await Promise.all(
          file.map (async (value) => {
            let up = await UploadCtr.upload(value)
            // let create = await imageModel.create(up)
            return up
          })
        )
      }
      else{
        result = await UploadCtr.upload(file)
        // result = await imageModel.create(resultImg)
      }
      console.log(result)
      res.json({uploaded: true, url: result.src, data: result})
      return result
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }
  
  static async list(req, res) {
    try {
      const {skip, limit } = req.query
      const count = await imageModel.countDocuments() 
      const list = await imageModel.find({})
                            .sort({created_time: -1})
                            .skip(Number(skip) || 0)
                            .limit(Number(limit) || 20)
      return res.send({success: true, data: list, count})
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const id = req.params.id
      if(!id) 
        return res.status(500).send({success: false, message: "No id image"})
      let result = await imageModel.findByIdAndDelete(id)
      if(!result) 
        return res.status(500).send({success: false, message: "Not find image!"})
      let delImg = await UploadCtr.destroy(result.public_id)
      return res.send({success: true, data: delImg})
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }
}

module.exports = Image;
