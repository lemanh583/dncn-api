const roles = require("../model/roles");
const users = require("../model/users");
const bcrypt = require("bcryptjs")

const seeder = async () => {
    try {
      const find = await roles.findOne({
        name: "Administrator",
        role: 0,
        descriptions: "Quyền quản trị cao nhất",
      });
  
      if (!find) {
        const data = [
          {
            name: "Administrator",
            role: 0,
            descriptions: "Quyền quản trị cao nhất",
          },
          {
            name: "Moderator",
            role: 1,
            descriptions: "Quyền dưới admin, đăng bài, xoá user",
          },
          {
            name: "Collaborators",
            role: 2,
            descriptions: "Cộng tác viên (đăng bài)",
          },
          {
            name: "Member",
            role: 3,
            descriptions: "Cộng tác viên (đăng bài)",
          },
        ];
        await Promise.all(
          data.map(async (value) => {
            await roles.create(value);
          })
        );
      }
  
      const findAdmin = await users.findOne({
        username: "admin",
        email: "admin@admin.com",
        name: "admin",
        role: 0,
        note: "admin",
      });
      if (!findAdmin) {
        await users.create({
          username: "admin",
          email: "admin@admin.com",
          name: "admin",
          password: bcrypt.hashSync("1234567", 10),
          role: 0,
          note: "admin",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

module.exports = seeder