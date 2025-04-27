const Staff = require('../model/StaffModel');
const Attendance = require('../model/AttendanceModel');
const moment = require('moment-timezone');


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

const createCheckIn = async (staffId, checkInTime, notes, status) => {
  try {
    const staff = await Staff.findById(staffId).select('staffcode');

    const vietnamTime = moment.tz(checkInTime, "Asia/Ho_Chi_Minh").format();

    const attendance = new Attendance({
      staffId: staff.id,
      staffcode: staff.staffcode,
      checkInTime: vietnamTime,
      notes,
      status
    })
    return await attendance.save();
  } catch (error) {
    throw new Error(`Lỗi khi tạo check-in: ${error.message}`);
  }
};

const updateCheckOut = async (attendanceId, checkOutTime) => {
  try {
    const vietnamTime = moment.tz(checkOutTime, "Asia/Ho_Chi_Minh").format();

    const attendance = await Attendance.findByIdAndUpdate(
      attendanceId,
      { checkOutTime: vietnamTime },
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

const getCheckinsByDate = async (date) => {
  const startOfDay = new Date(`${date}T00:00:00.000Z`);
  const endOfDay = new Date(`${date}T23:59:59.999Z`);

  const checkins = await Attendance.find({
    checkInTime: {
      $gte: startOfDay,
      $lte: endOfDay,
    }
  });

  return checkins;
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


const getAttendanceById = async (attendanceId) => {
  try {
    return await Attendance.findById(attendanceId).populate('staffId', 'name staffcode');
  } catch (error) {
    throw new Error(`Lỗi khi lấy bản ghi điểm danh theo ID: ${error.message}`);
  }
};


module.exports = {
  saveFaceEmbedding,
  createCheckIn,
  updateCheckOut,
  getAttendanceByStaffId,
  getAllAttendance,
  getAttendanceById,
  getCheckinsByDate
};
