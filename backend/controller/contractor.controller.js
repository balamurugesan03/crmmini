const Contractor = require("../models/contractor.model");

// Get All
exports.getContractors = async (req, res) => {
    try {
        const contractors = await Contractor.find();
        res.json(contractors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Create
exports.createContractor = async (req, res) => {
    try {
        const contractor = new Contractor(req.body);
        await contractor.save();
        res.json(contractor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update
exports.updateContractor = async (req, res) => {
    try {
        const contractor = await Contractor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(contractor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete
exports.deleteContractor = async (req, res) => {
    try {
        await Contractor.findByIdAndDelete(req.params.id);
        res.json({ message: "Contractor Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
