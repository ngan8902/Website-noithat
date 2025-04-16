const express = require('express');
const router = express.Router();
const attendanceController = require('../controller/AttendanceController')
const { upload } = require('../service/ImagesService')


router.post('/save-face', upload.single('faceImage'), attendanceController.saveFace);
router.post('/verify-face', attendanceController.verifyFace);

router.post('/check-in', attendanceController.checkIn);
router.patch('/check-out', attendanceController.checkOut); 

router.get('/staff/:staffId', attendanceController.getAttendanceHistoryByStaff);
router.get('/', attendanceController.getAllAttendanceHistory);

// API để lấy chi tiết một bản ghi điểm danh theo ID
router.get('/:attendanceId', attendanceController.getAttendanceDetails);


module.exports = router