const express = require('express');
const router = express.Router();
const attendanceController = require('../controller/AttendanceController')
const { upload } = require('../service/ImagesService')
const {authenticateStaff} = require('../middleware/authMiddleware')


router.post('/save-face', upload.single('faceImage'), attendanceController.saveFace);

router.post('/check-in', attendanceController.checkIn);
router.patch('/check-out', attendanceController.checkOut); 

router.get('/all-attendance', attendanceController.getAllAttendanceHistory);
router.get('/today-checkins', attendanceController.getTodayCheckins);

router.get('/:staffId',authenticateStaff, attendanceController.getAttendanceHistoryByStaff);

// API để lấy chi tiết một bản ghi điểm danh theo ID
router.get('/:attendanceId', attendanceController.getAttendanceDetails);


module.exports = router