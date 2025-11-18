const express = require("express");
const router = express.Router();
const contractorController = require("../controller/contractor.controller");

router.get("/", contractorController.getContractors);
router.post("/", contractorController.createContractor);
router.put("/:id", contractorController.updateContractor);
router.delete("/:id", contractorController.deleteContractor);

module.exports = router;
