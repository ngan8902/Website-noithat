const express = require("express");
const router = express.Router();
const send = require("../controller/EmailController");

router.post("/send-review", send.sendReviewReminder);
router.put("/ship/:id", send.shipOrder);

module.exports = router;
