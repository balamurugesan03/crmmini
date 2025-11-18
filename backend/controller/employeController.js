const Employee = require("../models/employee");

// Get All
exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create
exports.createEmployee = async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update
exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete
exports.deleteEmployee = async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: "Employee Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
