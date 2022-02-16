const userModel = require("../model/users")
const postModel = require("../model/posts")
const categoryModel = require("../model/categories")
class Dashboard {
    static async get (req, res) {
        try {
            let time = new Date()
            let timeCurrent = Date.now()
            let timeFrom = new Date(time.getFullYear(), time.getMonth(), time.getDate()).getTime()
            console.log('timeC', timeCurrent)
            console.log('timeF', timeFrom)
            const condition = {
                created_time: {
                    $gte: Number(timeFrom),
                    $lte: Number(timeCurrent)
                }
            }
            const userBlock = await userModel.countDocuments({active: false})
            const member = await userModel.countDocuments({role: 3})
            const collaborators = await userModel.countDocuments({role: 2})
            const moderator = await userModel.countDocuments({role: 1})
            const userToday = await userModel.countDocuments(condition)
            const postActive = await postModel.countDocuments({approved: "1"})
            const postNotActive= await postModel.countDocuments({approved: "0"})
            const postToday = await postModel.countDocuments(condition)
            const categories = await categoryModel.countDocuments({})
            const data = {
                userBlock,
                member,
                collaborators,
                moderator,
                userToday,
                postActive,
                postNotActive,
                categories,
                postToday
            }
            return res.send({success: true, data: data})
        } catch (error) {
            console.error(error)
            return res.status(500).send({success: false, message: error.message})
        }
    }

}

module.exports = Dashboard