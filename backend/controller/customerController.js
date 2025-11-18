const Customer = require("../models/customer.model");

// Create a new customer
exports.createCustomer = async (req, res) => {
    try {
        // Create the customer; dueDate will be auto-calculated by the schema pre-save hook
        const customer = new Customer(req.body);
        const savedCustomer = await customer.save();

        // Populate contractor info before returning
        await savedCustomer.populate("contractorId", "name status");

        res.status(201).json(savedCustomer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all customers with contractor details
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().populate("contractorId", "name status");
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id).populate("contractorId", "name status");
        if (!customer) return res.status(404).json({ message: "Customer not found" });

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update customer
exports.updateCustomer = async (req, res) => {
    try {
        // dueDate will be auto-calculated by pre 'findOneAndUpdate' hook
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate("contractorId", "name status");

        if (!updatedCustomer) return res.status(404).json({ message: "Customer not found" });

        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) return res.status(404).json({ message: "Customer not found" });

        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
