const mongoose = require("mongoose");
require("dotenv").config();
const { insertRoleData } = require('./insertDefaultRoleData');
const { insertAdminData } = require("./insertDefaultAdminData");

const MONGO_URI = process.env.MONGO_DB || "mongodb://localhost:27017/your_database";

async function executeCommonData() {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(":::[Migration] Connected to MongoDB:::");

        // Insert Default Data Functions
        await insertRoleData(mongoose);
        await insertAdminData(mongoose)

        await mongoose.disconnect();
        console.log(":::[Migration] Close Connected to MongoDB:::");
        process.exit(0); // Exit the process
    } catch(error) {
        console.error("Migration failed", error);
        process.exit(1);
    }
}

executeCommonData();