const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    customerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Customer",
        required: true
    },
    employeeId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Employee",
        required: true
    },
    contractorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Contractor"
    },
    dueDate: { type: Date, required: true },
    priority: { 
        type: String, 
        enum: ["Low", "Medium", "High"], 
        default: "Medium" 
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed", "Cancelled"],
        default: "Pending"
    },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);