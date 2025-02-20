const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        role_id: { type: Number, required: true},
        name: { type: String, required: true},
        description: { type: String, required: true},
        accessApp: { type: String, required: true}
    },
    {
        timestamps: true, //Thời gian tạo và update
    }
);
const Role = mongoose.model("Role", userSchema);
module.exports = Role;