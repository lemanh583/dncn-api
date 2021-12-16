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
            let create = await imageModel.create(up)
            return create
          })
        )
      }
      else{
        let resultImg = await UploadCtr.upload(file)
        result = await imageModel.create(resultImg)
      }
      // res.send({success: true, data: result})
      res.json({uploaded: true, url: result.src, data: result})
      // console.log('result', result)
      return result
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }
  
  static async get(req, res) {
    try {
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
      return delImg
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }
}

module.exports = Image;
