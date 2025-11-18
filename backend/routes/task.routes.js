const express = require("express");
const router = express.Router();
const taskController = require("../controller/taskController");

// Task routes
router.post("/", taskController.createTask);
router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

// Task filtering routes
router.get("/employee/:employeeId", taskController.getTasksByEmployee);
router.get("/customer/:customerId", taskController.getTasksByCustomer);

// Customer data for task assignment
router.get("/customer-data/:customerId", taskController.getCustomerForTaskAssignment);

module.exports = router;