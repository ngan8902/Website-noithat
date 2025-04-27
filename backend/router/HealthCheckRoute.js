const express = require("express");
const router = express.Router();
const send = require("../controller/EmailController");

router.get("/", (req, res) => {
    res.end("ping successfully");
});


module.exports = router;
