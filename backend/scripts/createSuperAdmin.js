const mongoose = require("mongoose");
const User = require("../models/user.model");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/mern_demo", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed", error);
        process.exit(1);
    }
};

const createSuperAdmin = async () => {
    try {
        await connectDB();
        
        const existingSuperAdmin = await User.findOne({ username: "superadmin" });
        if (existingSuperAdmin) {
            console.log("⚠️  Superadmin already exists");
            process.exit(0);
        }

        const superAdmin = new User({
            username: "superadmin",
            password: "admin123",
            role: "superadmin"
        });

        await superAdmin.save();
        console.log("✅ Superadmin created successfully");
        console.log("Username: superadmin");
        console.log("Password: admin123");
        console.log("⚠️  Please change the default password after first login");
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating superadmin:", error);
        process.exit(1);
    }
};

createSuperAdmin();