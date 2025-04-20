const express = require("express");
const router = express.Router();
const dashboardController = require("../controller/DashBoardController");

router.get("/best-sellers", dashboardController.getBestSellers);
router.get("/top-customers", dashboardController.getTopSpendingCustomers);
router.get("/daily-revenue", dashboardController.getDailyRevenue);
router.get("/monthly-revenue", dashboardController.getMonthlyRevenue);

module.exports = router;
