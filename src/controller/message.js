const messagesModel = require("../model/messages")
class Messages {
    static async create (req, res) {
        try {
            const data = req.body
            const result = await messagesModel.create(data)
            return res.send({success: true, data: result})
        } catch (error) {
            return res.status(500).send({success: false, message: error.message})
        }
    }

    static async list (req, res) {
        try {
            const id = req.params.id //id conversion
            if(!id)
                return res.status(500).send({success: false, message: "No id"})
            const result = await messagesModel.find({conversion_id: id})
            return res.send({success: true, data: result})
        } catch (error) {
            return res.status(500).send({success: false, message: error.message})
        }
    }

    static async get (req, res) {
        try {
            
        } catch (error) {
            return res.status(500).send({success: false, message: error.message})
        }
    }
}

module.exports = Messages