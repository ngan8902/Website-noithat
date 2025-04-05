const express = require("express");
const router = express.Router();
const { initiateMomoPayment } = require("../controller/MomoController");

router.post("/pay", initiateMomoPayment);

module.exports = router;
