const attendanceService = require('../service/AttendanceService');

const saveFace = async (req, res) => {
    try {
        const staffcode = req.body.staffcode;
        const faceEmbeddingString = req.body.faceEmbedding;
        const parsedFaceEmbedding = JSON.parse(faceEmbeddingString);

        if (!staffcode) {
            return res.status(400).json({ error: 'Vui lòng cung cấp mã nhân viên.' });
        }
        if (!faceEmbeddingString) {
            return res.status(400).json({ error: 'Vui lòng cung cấp dữ liệu embedding khuôn mặt.' });
        }

        await attendanceService.saveFaceEmbedding(staffcode, parsedFaceEmbedding);
        res.status(200).json({ message: 'Đăng ký khuôn mặt thành công!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const checkIn = async (req, res) => {
    try {
        const { staffId, checkInTime, notes, status } = req.body;
        const attendance = await attendanceService.createCheckIn(staffId, checkInTime, notes, status);
        res.status(201).json({ message: 'Check-in thành công!', data: attendance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const checkOut = async (req, res) => {
    try {
        const { attendanceId, checkOutTime } = req.body;
        const attendance = await attendanceService.updateCheckOut(attendanceId, checkOutTime);
        res.status(200).json({ message: 'Check-out thành công!', data: attendance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAttendanceHistoryByStaff = async (req, res) => {
    try {
        const staffId = req.payload.id;;
        const { startDate, endDate } = req.query;
        const history = await attendanceService.getAttendanceByStaffId(staffId, startDate, endDate);
        res.status(200).json({ data: history });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllAttendanceHistory = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const history = await attendanceService.getAllAttendance(startDate, endDate);
        res.status(200).json({ data: history });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAttendanceDetails = async (req, res) => {
    try {
        const attendanceId = req.params.attendanceId;
        const attendance = await attendanceService.getAttendanceById(attendanceId);
        if (!attendance) {
            return res.status(404).json({ message: 'Không tìm thấy bản ghi điểm danh.' });
        }
        res.status(200).json({ data: attendance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTodayCheckins = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: "Missing date parameter (YYYY-MM-DD)" });
        }

        const checkins = await attendanceService.getCheckinsByDate(date);

        return res.status(200).json(checkins);
    } catch (error) {
        console.error("Error fetching today's check-ins:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    saveFace,
    checkIn,
    checkOut,
    getAttendanceHistoryByStaff,
    getAllAttendanceHistory,
    getAttendanceDetails,
    getTodayCheckins
};