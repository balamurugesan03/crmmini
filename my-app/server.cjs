const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let tasks = [
    {
        id: 1,
        title: "Setup Development Environment",
        description: "Install and configure all necessary development tools",
        status: "pending",
        priority: "high",
        assignedTo: null,
        projectId: 1,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        deadline: new Date('2024-01-20')
    },
    {
        id: 2,
        title: "Design Database Schema",
        description: "Create comprehensive database schema for the application",
        status: "in-progress",
        priority: "high",
        assignedTo: 1,
        projectId: 1,
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-17'),
        deadline: new Date('2024-01-25')
    },
    {
        id: 3,
        title: "Implement User Authentication",
        description: "Build secure user authentication system with JWT",
        status: "completed",
        priority: "medium",
        assignedTo: 2,
        projectId: 1,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18'),
        deadline: new Date('2024-01-30')
    }
];

let nextTaskId = 4;

// Sample employees data
let employees = [
    {
        id: 1,
        _id: '1',
        name: 'John Doe',
        status: 'Active',
        email: 'john@example.com'
    },
    {
        id: 2,
        _id: '2',
        name: 'Jane Smith',
        status: 'Active',
        email: 'jane@example.com'
    },
    {
        id: 3,
        _id: '3',
        name: 'Mike Johnson',
        status: 'Inactive',
        email: 'mike@example.com'
    }
];

// Sample customers data
let customers = [
    {
        id: 1,
        _id: '1',
        customerName: 'ABC Corporation',
        contractorId: '1',
        phoneNumber: '123-456-7890',
        dueDays: 7,
        todayDate: new Date('2024-01-15'),
        dueDate: new Date('2024-01-22'),
        status: 'New',
        amount: 5000,
        advance: 1000,
        balance: 4000
    },
    {
        id: 2,
        _id: '2',
        customerName: 'XYZ Industries',
        contractorId: '2',
        phoneNumber: '987-654-3210',
        dueDays: 10,
        todayDate: new Date('2024-01-16'),
        dueDate: new Date('2024-01-26'),
        status: 'Process',
        amount: 8000,
        advance: 2000,
        balance: 6000
    }
];

// Sample contractors data
let contractors = [
    {
        id: 1,
        _id: '1',
        name: 'Smith Construction',
        status: 'Active',
        phone: '555-0001',
        email: 'contact@smithconstruction.com'
    },
    {
        id: 2,
        _id: '2',
        name: 'Johnson Builders',
        status: 'Active',
        phone: '555-0002',
        email: 'info@johnsonbuilders.com'
    },
    {
        id: 3,
        _id: '3',
        name: 'Wilson Contractors',
        status: 'Inactive',
        phone: '555-0003',
        email: 'support@wilsoncontractors.com'
    }
];

let nextEmployeeId = 4;
let nextCustomerId = 3;
let nextContractorId = 4;

app.get('/api/tasks', (req, res) => {
    const { status, priority, assignedTo, projectId, search } = req.query;
    
    let filteredTasks = [...tasks];
    
    if (status) {
        filteredTasks = filteredTasks.filter(task => task.status === status);
    }
    
    if (priority) {
        filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }
    
    if (assignedTo) {
        filteredTasks = filteredTasks.filter(task => task.assignedTo == assignedTo);
    }
    
    if (projectId) {
        filteredTasks = filteredTasks.filter(task => task.projectId == projectId);
    }
    
    if (search) {
        const searchLower = search.toLowerCase();
        filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(searchLower) ||
            task.description.toLowerCase().includes(searchLower)
        );
    }
    
    res.json({ data: filteredTasks, total: filteredTasks.length });
});

app.get('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({ data: task });
});

app.post('/api/tasks', (req, res) => {
    const { title, description, priority, assignedTo, projectId, deadline, customerId, contractorId } = req.body;
    
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    
    const validStatuses = ['pending', 'in-progress', 'completed'];
    const validPriorities = ['low', 'medium', 'high'];
    
    const newTask = {
        id: nextTaskId++,
        title,
        description: description || '',
        status: 'pending',
        priority: validPriorities.includes(priority) ? priority : 'medium',
        assignedTo: assignedTo || null,
        projectId: projectId ? parseInt(projectId) : null,
        customerId: customerId || null,
        contractorId: contractorId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deadline: deadline ? new Date(deadline) : null
    };
    
    tasks.push(newTask);
    res.status(201).json({ data: newTask, message: 'Task created successfully' });
});

app.put('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    const { title, description, status, priority, assignedTo, projectId, deadline, customerId, contractorId } = req.body;
    const validStatuses = ['pending', 'in-progress', 'completed'];
    const validPriorities = ['low', 'medium', 'high'];
    
    const updatedTask = {
        ...tasks[taskIndex],
        updatedAt: new Date()
    };
    
    if (title !== undefined) updatedTask.title = title;
    if (description !== undefined) updatedTask.description = description;
    if (status !== undefined && validStatuses.includes(status)) updatedTask.status = status;
    if (priority !== undefined && validPriorities.includes(priority)) updatedTask.priority = priority;
    if (assignedTo !== undefined) updatedTask.assignedTo = assignedTo || null;
    if (projectId !== undefined) updatedTask.projectId = projectId ? parseInt(projectId) : null;
    if (customerId !== undefined) updatedTask.customerId = customerId || null;
    if (contractorId !== undefined) updatedTask.contractorId = contractorId || null;
    if (deadline !== undefined) updatedTask.deadline = deadline ? new Date(deadline) : null;
    
    tasks[taskIndex] = updatedTask;
    res.json({ data: updatedTask, message: 'Task updated successfully' });
});

app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    const deletedTask = tasks.splice(taskIndex, 1)[0];
    res.json({ data: deletedTask, message: 'Task deleted successfully' });
});

app.post('/api/tasks/:id/assign', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { employeeId } = req.body;
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    if (!employeeId) {
        return res.status(400).json({ error: 'Employee ID is required' });
    }
    
    tasks[taskIndex].assignedTo = parseInt(employeeId);
    tasks[taskIndex].updatedAt = new Date();
    
    res.json({ data: tasks[taskIndex], message: 'Task assigned successfully' });
});

app.post('/api/tasks/:id/status', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { status } = req.body;
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    const validStatuses = ['pending', 'in-progress', 'completed'];
    
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be one of: pending, in-progress, completed' });
    }
    
    tasks[taskIndex].status = status;
    tasks[taskIndex].updatedAt = new Date();
    
    res.json({ data: tasks[taskIndex], message: 'Task status updated successfully' });
});

app.get('/api/tasks/stats/summary', (req, res) => {
    const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        overdue: tasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'completed').length,
        highPriority: tasks.filter(t => t.priority === 'high').length
    };
    
    res.json({ data: stats });
});

app.get('/api/tasks/overdue', (req, res) => {
    const overdueTasks = tasks.filter(task => 
        task.deadline && 
        new Date(task.deadline) < new Date() && 
        task.status !== 'completed'
    );
    
    res.json({ data: overdueTasks, total: overdueTasks.length });
});

app.get('/api/tasks/by-priority/:priority', (req, res) => {
    const { priority } = req.params;
    const validPriorities = ['low', 'medium', 'high'];
    
    if (!validPriorities.includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority. Must be one of: low, medium, high' });
    }
    
    const priorityTasks = tasks.filter(task => task.priority === priority);
    res.json({ data: priorityTasks, total: priorityTasks.length });
});

// Employee endpoints
app.get('/api/employees', (req, res) => {
    res.json({ data: employees, total: employees.length });
});

app.get('/api/employees/:id', (req, res) => {
    const employeeId = req.params.id;
    const employee = employees.find(e => e._id === employeeId);
    
    if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json({ data: employee });
});

app.post('/api/employees', (req, res) => {
    const { name, status, email } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    
    const newEmployee = {
        id: nextEmployeeId,
        _id: nextEmployeeId.toString(),
        name,
        status: status || 'Active',
        email: email || ''
    };
    
    employees.push(newEmployee);
    nextEmployeeId++;
    res.status(201).json({ data: newEmployee, message: 'Employee created successfully' });
});

app.put('/api/employees/:id', (req, res) => {
    const employeeId = req.params.id;
    const employeeIndex = employees.findIndex(e => e._id === employeeId);
    
    if (employeeIndex === -1) {
        return res.status(404).json({ error: 'Employee not found' });
    }
    
    const { name, status, email } = req.body;
    const updatedEmployee = { ...employees[employeeIndex] };
    
    if (name !== undefined) updatedEmployee.name = name;
    if (status !== undefined) updatedEmployee.status = status;
    if (email !== undefined) updatedEmployee.email = email;
    
    employees[employeeIndex] = updatedEmployee;
    res.json({ data: updatedEmployee, message: 'Employee updated successfully' });
});

app.delete('/api/employees/:id', (req, res) => {
    const employeeId = req.params.id;
    const employeeIndex = employees.findIndex(e => e._id === employeeId);
    
    if (employeeIndex === -1) {
        return res.status(404).json({ error: 'Employee not found' });
    }
    
    const deletedEmployee = employees.splice(employeeIndex, 1)[0];
    res.json({ data: deletedEmployee, message: 'Employee deleted successfully' });
});

// Customer endpoints
app.get('/api/customers', (req, res) => {
    // Populate contractor data
    const populatedCustomers = customers.map(customer => ({
        ...customer,
        contractorId: typeof customer.contractorId === 'string' 
            ? contractors.find(c => c._id === customer.contractorId) || customer.contractorId
            : customer.contractorId
    }));
    res.json({ data: populatedCustomers, total: populatedCustomers.length });
});

app.get('/api/customers/:id', (req, res) => {
    const customerId = req.params.id;
    const customer = customers.find(c => c._id === customerId);
    
    if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Populate contractor data
    const populatedCustomer = {
        ...customer,
        contractorId: typeof customer.contractorId === 'string' 
            ? contractors.find(c => c._id === customer.contractorId) || customer.contractorId
            : customer.contractorId
    };
    
    res.json({ data: populatedCustomer });
});

app.post('/api/customers', (req, res) => {
    const { customerName, contractorId, phoneNumber, dueDays, todayDate, dueDate, status, amount, advance, balance } = req.body;
    
    if (!customerName) {
        return res.status(400).json({ error: 'Customer name is required' });
    }
    
    const newCustomer = {
        id: nextCustomerId,
        _id: nextCustomerId.toString(),
        customerName,
        contractorId: contractorId || null,
        phoneNumber: phoneNumber || '',
        dueDays: dueDays || 0,
        todayDate: todayDate ? new Date(todayDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : null,
        status: status || 'New',
        amount: amount || 0,
        advance: advance || 0,
        balance: balance || 0
    };
    
    customers.push(newCustomer);
    nextCustomerId++;
    res.status(201).json({ data: newCustomer, message: 'Customer created successfully' });
});

app.put('/api/customers/:id', (req, res) => {
    const customerId = req.params.id;
    const customerIndex = customers.findIndex(c => c._id === customerId);
    
    if (customerIndex === -1) {
        return res.status(404).json({ error: 'Customer not found' });
    }
    
    const updatedCustomer = { ...customers[customerIndex], ...req.body };
    
    if (req.body.todayDate) updatedCustomer.todayDate = new Date(req.body.todayDate);
    if (req.body.dueDate) updatedCustomer.dueDate = new Date(req.body.dueDate);
    
    customers[customerIndex] = updatedCustomer;
    res.json({ data: updatedCustomer, message: 'Customer updated successfully' });
});

app.delete('/api/customers/:id', (req, res) => {
    const customerId = req.params.id;
    const customerIndex = customers.findIndex(c => c._id === customerId);
    
    if (customerIndex === -1) {
        return res.status(404).json({ error: 'Customer not found' });
    }
    
    const deletedCustomer = customers.splice(customerIndex, 1)[0];
    res.json({ data: deletedCustomer, message: 'Customer deleted successfully' });
});

// Contractor endpoints
app.get('/api/contractors', (req, res) => {
    res.json({ data: contractors, total: contractors.length });
});

app.get('/api/contractors/:id', (req, res) => {
    const contractorId = req.params.id;
    const contractor = contractors.find(c => c._id === contractorId);
    
    if (!contractor) {
        return res.status(404).json({ error: 'Contractor not found' });
    }
    
    res.json({ data: contractor });
});

app.post('/api/contractors', (req, res) => {
    const { name, status, phone, email } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    
    const newContractor = {
        id: nextContractorId,
        _id: nextContractorId.toString(),
        name,
        status: status || 'Active',
        phone: phone || '',
        email: email || ''
    };
    
    contractors.push(newContractor);
    nextContractorId++;
    res.status(201).json({ data: newContractor, message: 'Contractor created successfully' });
});

app.put('/api/contractors/:id', (req, res) => {
    const contractorId = req.params.id;
    const contractorIndex = contractors.findIndex(c => c._id === contractorId);
    
    if (contractorIndex === -1) {
        return res.status(404).json({ error: 'Contractor not found' });
    }
    
    const updatedContractor = { ...contractors[contractorIndex], ...req.body };
    contractors[contractorIndex] = updatedContractor;
    res.json({ data: updatedContractor, message: 'Contractor updated successfully' });
});

app.delete('/api/contractors/:id', (req, res) => {
    const contractorId = req.params.id;
    const contractorIndex = contractors.findIndex(c => c._id === contractorId);
    
    if (contractorIndex === -1) {
        return res.status(404).json({ error: 'Contractor not found' });
    }
    
    const deletedContractor = contractors.splice(contractorIndex, 1)[0];
    res.json({ data: deletedContractor, message: 'Contractor deleted successfully' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.use((error, req, res, next) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Task Management API Server running on port ${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`  GET    /api/tasks - Get all tasks with optional filters`);
    console.log(`  GET    /api/tasks/:id - Get task by ID`);
    console.log(`  POST   /api/tasks - Create new task`);
    console.log(`  PUT    /api/tasks/:id - Update task`);
    console.log(`  DELETE /api/tasks/:id - Delete task`);
    console.log(`  POST   /api/tasks/:id/assign - Assign task to employee`);
    console.log(`  POST   /api/tasks/:id/status - Update task status`);
    console.log(`  GET    /api/tasks/stats/summary - Get task statistics`);
    console.log(`  GET    /api/tasks/overdue - Get overdue tasks`);
    console.log(`  GET    /api/tasks/by-priority/:priority - Get tasks by priority`);
});