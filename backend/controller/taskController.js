const Task = require("../models/task.model");
const Customer = require("../models/customer.model");

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const { customerId, employeeId, title, description, priority, notes } = req.body;

        // Fetch customer details to get contractor and due date info
        const customer = await Customer.findById(customerId).populate("contractorId");
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Auto-calculate due date based on customer's dueDate or dueDays
        let taskDueDate = customer.dueDate;
        if (!taskDueDate && customer.dueDays) {
            const today = new Date();
            taskDueDate = new Date(today.getTime() + (customer.dueDays * 24 * 60 * 60 * 1000));
        }

        const task = new Task({
            title,
            description,
            customerId,
            employeeId,
            contractorId: customer.contractorId?._id,
            dueDate: taskDueDate,
            priority,
            notes
        });

        const savedTask = await task.save();
        
        // Populate all references before returning
        await savedTask.populate([
            { path: "customerId", select: "customerName phoneNumber" },
            { path: "employeeId", select: "name status" },
            { path: "contractorId", select: "name status" }
        ]);

        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all tasks with populated references
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate([
            { path: "customerId", select: "customerName phoneNumber" },
            { path: "employeeId", select: "name status" },
            { path: "contractorId", select: "name status" }
        ]).sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get tasks by employee
exports.getTasksByEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const tasks = await Task.find({ employeeId }).populate([
            { path: "customerId", select: "customerName phoneNumber" },
            { path: "employeeId", select: "name status" },
            { path: "contractorId", select: "name status" }
        ]).sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get tasks by customer
exports.getTasksByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const tasks = await Task.find({ customerId }).populate([
            { path: "customerId", select: "customerName phoneNumber" },
            { path: "employeeId", select: "name status" },
            { path: "contractorId", select: "name status" }
        ]).sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate([
            { path: "customerId", select: "customerName phoneNumber" },
            { path: "employeeId", select: "name status" },
            { path: "contractorId", select: "name status" }
        ]);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update task
exports.updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate([
            { path: "customerId", select: "customerName phoneNumber" },
            { path: "employeeId", select: "name status" },
            { path: "contractorId", select: "name status" }
        ]);

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete task
exports.deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get customer details with contractor info for task assignment
exports.getCustomerForTaskAssignment = async (req, res) => {
    try {
        const { customerId } = req.params;
        const customer = await Customer.findById(customerId).populate("contractorId", "name status");
        
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Calculate due date if not already set
        let dueDate = customer.dueDate;
        if (!dueDate && customer.dueDays) {
            const today = new Date();
            dueDate = new Date(today.getTime() + (customer.dueDays * 24 * 60 * 60 * 1000));
        }

        const customerData = {
            _id: customer._id,
            customerName: customer.customerName,
            phoneNumber: customer.phoneNumber,
            contractor: customer.contractorId,
            dueDate: dueDate,
            dueDays: customer.dueDays,
            amount: customer.amount,
            status: customer.status
        };

        res.status(200).json(customerData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};