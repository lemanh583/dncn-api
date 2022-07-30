
const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(
      `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@db-news.mn3s0.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`
      // `mongodb://127.0.0.1:27017/dncn-news`
    );
    if (connect) console.log("🚀 DB connected 🚀");
  } catch (error) {
    console.error(error.message);
  }
};
module.exports = connectDB;
