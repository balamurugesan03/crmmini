const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    contractorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Contractor"
    },
    phoneNumber: { type: String },
    dueDays: { type: Number },
    todayDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    amount: { type: Number, default: 0 },
    advance: { type: Number, default: 0 },
    part01: { type: Number, default: 0 },
    part02: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },

    services: {
        exteriorElevation: { type: Boolean, default: false },
        exteriorElevationCount: { type: Number, default: 0 },
        exteriorDimensions: { type: Boolean, default: false },
        interiorWalkthrough: { type: Boolean, default: false },
        interiorWalkthroughCategory: { type: String },
        bathroomDesign: { type: Boolean, default: false },
        showElectricalPoint: { type: Boolean, default: false },
        interiorRenderImages: { type: Boolean, default: false },
        interiorRenderNotes: { type: String },
        interiorDimensions: { type: Boolean, default: false },
        layoutWalkthroughAndImages: { type: Boolean, default: false }, // NEW
        isometricView: { type: Boolean, default: false } // NEW
    },

    architecturalDrawing: {
        floorPlan: { type: Boolean, default: false },
        elevation: { type: Boolean, default: false },
        electricalPlan: { type: Boolean, default: false },
        furniturePlan: { type: Boolean, default: false },
        plumbingPlan: { type: Boolean, default: false },
        structuralPlan: { type: Boolean, default: false },
        notes: { type: String }
    },

    notes: { type: String },
    status: {
        type: String,
        enum: ["New", "Process", "Correction", "Payment", "Finished"],
        default: "New"
    }
}, { timestamps: true });

// Auto-calculate dueDate if dueDays is given
customerSchema.pre("save", function (next) {
    if (!this.todayDate) {
        this.todayDate = new Date();
    }
    if (this.dueDays != null && this.todayDate) {
        const today = new Date(this.todayDate);
        today.setDate(today.getDate() + this.dueDays);
        this.dueDate = today;
    }
    next();
});

// Also handle update case
customerSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (!update.todayDate) {
        update.todayDate = new Date();
    }
    if (update.dueDays != null && update.todayDate) {
        const today = new Date(update.todayDate);
        today.setDate(today.getDate() + update.dueDays);
        update.dueDate = today;
    }
    next();
});

module.exports = mongoose.model("Customer", customerSchema);
