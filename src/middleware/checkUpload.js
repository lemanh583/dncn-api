const checkUpload = (req, res, next) => {
    if(!req.files) {
        return res.status(500).send({success: false, message: "No img upload"})
    }
    const file = req.files.file
    if(file.size > 1024*1024) {
        return res.status(500).send({success: false, message: "File bigger 1024*1024"})
    }
    if(file.mimetype != 'image/png' && file.mimetype != 'image/jpeg' && file.mimetype != 'image/jpg') {
        return res.status(500).json({success: false, message: "Not format"})
    }
    next();
}

module.exports = checkUpload