const cloudinary = require("cloudinary").v2;
const imageModel = require("../model/images");
const mediaModel = require("../model/medias")
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
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
          console.log("file", file.tempFilePath);
          Upload.removeTmp(file.tempFilePath);
        }
      );
      let data = {
        public_id: result.public_id,
        src: result.secure_url,
      };
      const img = await imageModel.create(data);
      data.img = img;
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
      if (result.result != "ok") return false;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static removeTmp(path) {
    console.log(path);
    fs.unlink(path, (err) => {
      if (err) throw err;
    });
  }

  static async initGoogleDrive() {
    try {
      const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
      const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
      const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
      const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
      const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
      oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
      const drive = google.drive({
        version: "v3",
        auth: oauth2Client,
      });
      return drive;
    } catch (error) {
      console.error("init google", error);
      return false;
    }
  }

  static async googleUpload(req, res) {
    try {
      console.log("google upload", req.files);
      const drive = await Upload.initGoogleDrive();
      const file = req.files.file;
      let checkFile = Upload.checkFile(file)
      console.log('checkFile', checkFile)
      if (!checkFile) {
        return res.status(500).send({ success: false, message: "Not format or size large" });
      }
      console.log("file", file.data);
      let url = path.join(__dirname, "/../../" + file.tempFilePath + file.name.replace(/ /g,'-'));
      console.log("url", url);
      file.mv(file.tempFilePath + file.name.replace(/ /g,'-'));
      // console.log("url1", fs.createReadStream(url));
      const createFile = await drive.files.create({
        requestBody: {
          name: file.name,
          parents: ['1oveL1930IjNF5JHE39xqxHnMfJ3iTlLL'],
          mimeType: file.mimetype,
        },
        media: {
          mimeType: file.mimetype,
          body: fs.createReadStream(url),
        },
      });
      Upload.removeTmp(url);
      const fileId = createFile.data.id;
      console.log(fileId);
      const getUrl = await Upload.setFilePublic(fileId, drive);
      let mediaObj = {
        web_content_link: getUrl.data.webContentLink,
        web_view_link: getUrl.data.webViewLink,
        src: "https://drive.google.com/uc?export=view&id=" + fileId,
        type: checkFile,
        size: file.size,
        created_by: req.user_id
      }
      const rs = await mediaModel.create(mediaObj)
      return res.send({ success: true, data:  rs });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ success: false, message: error.message });
    }
  }

  static async setFilePublic(fileId, drive) {
    try {
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      const getUrl = await drive.files.get({
        fileId,
        fields: "webViewLink, webContentLink",
      });
      return getUrl;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static checkFile(file) {
    if (file.size > (5 * 1024 * 1024)) {
      return false;
    }
    if (/image\/.*/i.test(file.mimetype)) {
      return "image";
    }
    if (/video\/mp4/i.test(file.mimetype)) {
      return "video";
    }
    if (/application\/.*/i.test(file.mimetype) && file.mimetype != "application/x-msdownload") {
      return "file";
    }
    if (/audio\/mp3|audio\/mpe/i.test(type)) {
      return "audio";
    }
    return false;
  }
}

module.exports = Upload;
