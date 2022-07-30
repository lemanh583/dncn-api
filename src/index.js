require("dotenv").config();
const express = require("express");
const router = require("./router");
const cors = require("cors")
const fileUpload = require("express-fileupload");
const seeder = require("./config/seeder");
const connectDB = require("./config/connectDB")
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : 'src/tmp/'
}));

app.use(router);

const server = require('http').createServer(app)
const socketCtr =  require("./controller/socket")
socketCtr.connectSocket(server)

// connect DB
connectDB();

// insert document
seeder();


const PORT = process.env.PORT;
server.listen(PORT, console.log(`Server run on ${PORT}`));
