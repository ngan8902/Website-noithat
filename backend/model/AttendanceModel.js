const mongoose = require("mongoose")
const { Schema } = mongoose;

const attendanceSchema = new Schema({
    staffId: {
        type: Schema.Types.ObjectId,
        ref: 'Staff',
        required: true,
    },
    staffcode: {
        type: String,
    },
    checkInTime: {
        type: Date,
        required: true,
    },
    checkOutTime: {
        type: Date,
        default: null,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            default: [0, 0],
        },
    },
    notes: {
        type: String,
    },
    status: {
        type: String,
        enum: ['present', 'late'],
        default: 'present',
    },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;