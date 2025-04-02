const express = require("express");
const router = express.Router();
const ImagesController = require("../controller/ImagesController");
const { upload } = require("../service/ImagesService");
 

// API Upload file
router.post("/image", upload.single("image"), ImagesController.uploadFile);


module.exports = router;
