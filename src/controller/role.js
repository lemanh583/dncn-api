const roleModel = require("../model/roles")
class Role {

    static async list (req, res) {
        try {
            const list = await roleModel.find({})
            return res.send({succes: true, data: list})
        } catch (error) {
            console.error(error)
            return res.status(500).send({success: false, message: error.message})
        }
    }
}

module.exports = Role