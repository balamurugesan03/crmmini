const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const User = require("./models/user.model");

const customerRoutes = require("./routes/customerRoutes");

const app = express();

const initializeApp = async () => {
    await connectDB();
    
    const existingSuperAdmin = await User.findOne({ username: "superadmin" });
    if (!existingSuperAdmin) {
        const superAdmin = new User({
            username: "superadmin",
            password: "admin123",
            role: "superadmin"
        });
        await superAdmin.save();
        console.log("✅ Default superadmin created (username: superadmin, password: admin123)");
    }
};

initializeApp();

app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/employees", require("./routes/employee.routes"));
app.use("/api/contractors", require("./routes/contractor.routes"));
app.use("/api/tasks", require("./routes/task.routes"));
app.use("/api/customers", customerRoutes);




const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
