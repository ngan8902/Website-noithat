const Staff = require('../model/StaffModel');
const Attendance = require('../model/AttendanceModel');
const faceRecognitionService = require('../service/FaceRecognitionService');

// Lưu embedding khuôn mặt cho nhân viên
const saveFaceEmbedding = async (staffcode, faceEmbedding) => {
  try {
    const staff = await Staff.findOne({ staffcode: staffcode });
    if (!staff) {
      throw new Error('Không tìm thấy nhân viên theo mã này');
    }
    staff.faceEmbedding = faceEmbedding.flat();
    staff.faceRegistered = true;
    await staff.save();
  } catch (error) {
    throw new Error(`Lỗi khi lưu embedding khuôn mặt: ${error.message}`);
  }
};

// Xác minh embedding khuôn mặt đầu vào với các embedding đã lưu
const verifyFace = async (inputEmbedding) => {
  try {
      let processedEmbedding = inputEmbedding;

      if (typeof inputEmbedding === 'string') {
          try {
              processedEmbedding = JSON.parse(inputEmbedding);
          } catch (error) {
              console.error("Lỗi khi parse embedding từ chuỗi:", error);
              return null;
          }
      }

      const staffs = await Staff.find({ faceEmbedding: { $ne: [] } });
      let bestMatch = null;
      let maxSimilarity = -1; 

      for (const staff of staffs) {
          const storedEmbedding = staff.faceEmbedding;
          if (Array.isArray(storedEmbedding) && Array.isArray(processedEmbedding) && storedEmbedding.length > 0 && processedEmbedding.length > 0 && storedEmbedding.length === processedEmbedding.length) {
              const similarity = faceRecognitionService.calculateCosineSimilarity(processedEmbedding, storedEmbedding);
              if (similarity > maxSimilarity) { 
                  maxSimilarity = similarity;
                  bestMatch = staff.staffcode;
              }
          }
      }

      const THRESHOLD_SIMILARITY = 0.8; // Điều chỉnh ngưỡng cho độ tương đồng
      if (bestMatch && maxSimilarity >= THRESHOLD_SIMILARITY) {
          return bestMatch;
      }
      return null;
  } catch (error) {
      throw new Error(`Lỗi khi xác minh khuôn mặt: ${error.message}`);
  }
};

const createCheckIn = async (staffId, checkInTime, location, notes) => {
  try {
    const attendance = new Attendance({
      staffId,
      checkInTime,
      location,
      notes,
    });
    return await attendance.save();
  } catch (error) {
    throw new Error(`Lỗi khi tạo check-in: ${error.message}`);
  }
};

const updateCheckOut = async (attendanceId, checkOutTime) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      attendanceId,
      { checkOutTime },
      { new: true }
    );
    if (!attendance) {
      throw new Error('Không tìm thấy bản ghi điểm danh để cập nhật check-out.');
    }
    return attendance;
  } catch (error) {
    throw new Error(`Lỗi khi cập nhật check-out: ${error.message}`);
  }
};

const getAttendanceByStaffId = async (staffId, startDate, endDate) => {
  try {
    const query = { staffId };
    if (startDate && endDate) {
      query.checkInTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.checkInTime = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.checkInTime = { $lte: new Date(endDate) };
    }
    return await Attendance.find(query).populate('staffId', 'name staffcode');
  } catch (error) {
    throw new Error(`Lỗi khi lấy lịch sử điểm danh: ${error.message}`);
  }
};

const getAllAttendance = async (startDate, endDate) => {
  try {
    const query = {};
    if (startDate && endDate) {
      query.checkInTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.checkInTime = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.checkInTime = { $lte: new Date(endDate) };
    }
    return await Attendance.find(query).populate('staffId', 'name staffcode');
  } catch (error) {
    throw new Error(`Lỗi khi lấy tất cả lịch sử điểm danh: ${error.message}`);
  }
};

const getAttendanceById = async (attendanceId) => {
  try {
    return await Attendance.findById(attendanceId).populate('staffId', 'name staffcode');
  } catch (error) {
    throw new Error(`Lỗi khi lấy bản ghi điểm danh theo ID: ${error.message}`);
  }
};

module.exports = {
  saveFaceEmbedding,
  verifyFace,
  createCheckIn,
  updateCheckOut,
  getAttendanceByStaffId,
  getAllAttendance,
  getAttendanceById,
};
