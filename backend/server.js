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
const ImagesRoute = require("./router/ImagesRoute")

dotenv.config();

// Tắt các chính sách bảo mật ngăn chặn tải tài nguyên chéo
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

// Cấu hình cookie-parser trước CORS
app.use(cookieParser());

// Cấu hình CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // URL của frontend
    credentials: true, // Cho phép gửi cookie và token
    allowedHeaders: ["Content-Type", "Authorization", "token", "staff-token"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposedHeaders: ["Set-Cookie"],
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
