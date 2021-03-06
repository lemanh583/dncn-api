const cloudinary = require("cloudinary").v2;
const imageModel = require("../model/images")
const fs = require("fs");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

class Upload {
  static async upload(file) {
    try {
      let result = await cloudinary.uploader.upload(
        file.tempFilePath,
        { folder: "news" },
        async (error) => {
          if (error) throw error;
          console.log('file', file.tempFilePath)
          Upload.removeTmp(file.tempFilePath);
        }
      );
      let data = {
        public_id: result.public_id, 
        src: result.secure_url
      }
      const img = await imageModel.create(data)
      data.img = img
      return data;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static async destroy(public_id) {
    try {
      let result = await cloudinary.uploader.destroy(public_id, async (error) => {
        if (error) throw error;
      });
      if(result.result != 'ok') return false
      return true
    } catch (error) {
      console.error(error);
      return false
    }
  }

  static removeTmp(path) {
    console.log(path)
    fs.unlink(path, (err) => {
      if (err) throw err;
    });
  }
}

module.exports = Upload;
