const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        role_id: { type: Number, required: true},
        name: { type: String, required: true},
        description: { type: String, required: false},
        accessApp: { type: String, required: false}
    },
    {
        timestamps: true, //Thời gian tạo và update
    }
);
const Role = mongoose.model("Role", userSchema);
module.exports = Role;