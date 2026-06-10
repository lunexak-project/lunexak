require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const connectDB = require("./src/config/db");
const User = require("./src/models/User");

const seedUsers = async () => {
    try {
        await connectDB();

        const passwordHash = await bcrypt.hash("123456", 10);

        // ADMIN
        let admin = await User.findOne({
            email: "admin@gmail.com",
        });

        if (!admin) {
            await User.create({
                name: "Admin",
                email: "admin@gmail.com",
                passwordHash,
                role: "admin",
                isVerified: true,
                isActive: true,
            });

            console.log("✅ Admin Created");
        } else {
            console.log("ℹ️ Admin Already Exists");
        }

        // EMPLOYEE
        let employee = await User.findOne({
            email: "employee@gmail.com",
        });

        if (!employee) {
            await User.create({
                name: "Employee",
                email: "employee@gmail.com",
                passwordHash,
                role: "employee",
                isVerified: true,
                isActive: true,
            });

            console.log("✅ Employee Created");
        } else {
            console.log("ℹ️ Employee Already Exists");
        }

        console.log("🎉 Seed Complete");

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedUsers();