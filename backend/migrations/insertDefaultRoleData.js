const RoleModel = require("../model/RoleModel");

const staffData = [
    { role_id: 1, name: "Quản lí nhân sự" },
    { role_id: 2, name: "Nhân viên" }
];

// Function to insert data
const insertRoleData = async (mongoose) => {
    try {
        // Insert data if not already present
        for (const data of staffData) {
            const exists = await RoleModel.findOne({ role_id: data.role_id });
            if (!exists) {
                await RoleModel.create(data);
                console.log(`Inserted: ${data.name}`);
            } else {
                console.log(`Skipped (already exists): ${data.name}`);
            }
        }
        console.log("Migration role data completed successfully");
    } catch (error) {
        console.error("Migration failed", error);
        process.exit(1);
    }
};

module.exports = {
    insertRoleData
}
