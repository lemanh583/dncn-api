require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const router = require("./router");
const roles = require("./model/roles");
const users = require("./model/uses");
// const path = require("path");
const app = express();
app.use(express.json());
app.use(router);

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(
      `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@db-news.mn3s0.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`
    );
    if (connect) console.log("DB connected");
  } catch (error) {
    console.error(error.message);
  }
};
connectDB();

// insert document

const seeder = async (req, res) => {
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

seeder();

// app.use('/static', express.static(path.join(__dirname,"./public/dist/static/")));

// app.get("/", (req, res) => {
//     res.sendFile('index.html', { root: path.join(__dirname, './public/dist/') });
//     console.log(path.join(__dirname, './public/dist/'))
// })
const PORT = process.env.PORT;
app.listen(PORT, console.log(`Server run on ${PORT}`));
