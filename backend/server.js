const express = require("express");
const { createServer } = require('http');
const app = express();
const dotenv = require('dotenv')
const cors = require('cors')
const server = createServer(app);
app.set('port', process.argv[2] || 8000);
const port = process.env.PORT || app.get('port');
const mongoose = require("mongoose");
const routers = require("./router");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { initializeChatSocket } = require("./chat/chat.socket");

dotenv.config(); 

// Tắt các chính sách bảo mật ngăn chặn tải tài nguyên chéo
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// Cấu hình cookie-parser trước CORS
app.use(cookieParser());

// Cấu hình CORS
app.use(
  cors({
    origin: [
      'http://localhost:3000', 
      'http://192.168.0.104:3000', 
      'https://website-noithat-amber.vercel.app', 
      'https://furniture-9gw0hdlww-ngans-projects.vercel.app'
    ], 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token', 'staff-token'],
    // exposedHeaders: ['Set-Cookie', ''],
  })
);


// Hỗ trợ preflight requests
app.options("*", cors());

// Middleware xử lý dữ liệu request
app.use(express.static(__dirname + "/public/build"));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/upload", express.static("upload"));

routers(app);

mongoose.connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log('Connect Db success!')
  })
  .catch((err) => {
    console.error("Lỗi kết nối MongoDB:", err)  
  })

initializeChatSocket(server);

server.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});
