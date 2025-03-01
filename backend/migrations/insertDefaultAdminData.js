const StaffModel = require("../model/StaffModel");
const bcrypt = require("bcrypt");

const adminData = {
    name: "Admin",
    username: "admin",
    email: "admin@example.com",
    password: "admin123",
    role_id: 1, 
    phone: 123456789,
    position: "Quản lí nhân sự",
    address: "19 ĐHT",
    dob: "1/1/1988",
};

const insertAdminData = async (mongoose) => {
    try {
        const exists = await StaffModel.findOne({ username: adminData.username });
        if (!exists) {
            const hashedPassword = await bcrypt.hash(adminData.password, 10);
            adminData.password = hashedPassword;

            await StaffModel.create(adminData);
            console.log(`Inserted admin: ${adminData.username}`);
        } else {
            console.log(`Skipped (Admin already exists): ${adminData.username}`);
        }
        console.log("Migration admin data completed successfully");
    } catch (error) {
        console.error("Migration failed", error);
        process.exit(1);
    }
};

module.exports = {
    insertAdminData
};
