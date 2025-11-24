import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Form,
    Input,
    Select,
    Table,
    Tag,
    Space,
    Modal,
    Row,
    Col,
    Typography,
    message,
    Popconfirm
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import taskService from '../api/taskService';
import customerService from '../api/customerService';
import employeeService from '../api/employeeService';

const { Title } = Typography;
const { Option } = Select;

const TaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [form] = Form.useForm();
    const [customerData, setCustomerData] = useState(null);
    const [loading, setLoading] = useState(false);
    // Filters
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    

    useEffect(() => {
        fetchTasks();
        fetchCustomers();
        fetchEmployees();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await taskService.getAll();
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            message.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await customerService.getAll();
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
            message.error('Failed to fetch customers');
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await employeeService.getAll();
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            message.error('Failed to fetch employees');
        }
    };

    const handleCustomerChange = async (customerId) => {
        if (customerId) {
            try {
                const response = await taskService.getCustomerForAssignment(customerId);
                setCustomerData(response.data);
            } catch (error) {
                console.error('Error fetching customer data:', error);
                message.error('Failed to fetch customer data');
                setCustomerData(null);
            }
        } else {
            setCustomerData(null);
        }
    };

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            if (editingTask) {
                await taskService.update(editingTask._id, values);
                message.success('Task updated successfully');
            } else {
                await taskService.create(values);
                message.success('Task created successfully');
            }
            
            form.resetFields();
            setCustomerData(null);
            setShowForm(false);
            setEditingTask(null);
            fetchTasks();
        } catch (error) {
            console.error('Error saving task:', error);
            message.error('Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        form.setFieldsValue({
            title: task.title,
            description: task.description,
            customerId: task.customerId._id,
            employeeId: task.employeeId._id,
            priority: task.priority,
            notes: task.notes
        });
        setShowForm(true);
        
        // Fetch customer data for editing
        if (task.customerId._id) {
            handleCustomerChange(task.customerId._id);
        }
    };

    const handleDelete = async (id) => {
        try {
            await taskService.delete(id);
            message.success('Task deleted successfully');
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
            message.error('Failed to delete task');
        }
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            await taskService.update(taskId, { status: newStatus });
            message.success('Task status updated');
            fetchTasks();
        } catch (error) {
            console.error('Error updating task status:', error);
            message.error('Failed to update task status');
        }
    };

    const resetForm = () => {
        form.resetFields();
        setCustomerData(null);
        setShowForm(false);
        setEditingTask(null);
    };

    // Filter tasks by selected employee
    const filteredTasks = selectedEmployee 
        ? tasks.filter(task => task.employeeId?._id === selectedEmployee)
        : tasks;

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{text}</div>
                    {record.description && (
                        <div style={{ fontSize: '12px', color: '#666' }}>{record.description}</div>
                    )}
                </div>
            ),
        },
        {
            title: 'Customer',
            dataIndex: ['customerId', 'customerName'],
            key: 'customer',
        },
        {
            title: 'Employee',
            dataIndex: ['employeeId', 'name'],
            key: 'employee',
        },
        {
            title: 'Contractor',
            dataIndex: ['contractorId', 'name'],
            key: 'contractor',
            render: (text) => text || 'N/A',
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority) => {
                const colors = {
                    High: 'red',
                    Medium: 'orange',
                    Low: 'green',
                };
                return <Tag color={colors[priority]}>{priority}</Tag>;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Select
                    value={status}
                    style={{ width: 120 }}
                    onChange={(value) => handleStatusUpdate(record._id, value)}
                >
                    <Option value="Pending">Pending</Option>
                    <Option value="In Progress">In Progress</Option>
                    <Option value="Completed">Completed</Option>
                    <Option value="Cancelled">Cancelled</Option>
                </Select>
            ),
        },
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this task?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <Row
                className="page-header"
                justify="space-between"
                align="middle"
                style={{ marginBottom: '24px' }}
                gutter={[16, 16]}
            >
                <Col xs={24} sm={12}>
                    <Title level={3} style={{ margin: 0, color: '#1e293b' }}>Task Management</Title>
                </Col>
                <Col xs={24} sm={12} style={{ textAlign: 'right' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setShowForm(true)}
                        size="large"
                        block={window.innerWidth <= 480}
                    >
                        Assign New Task
                    </Button>
                </Col>
            </Row>

            {/* Employee Filter */}
            <Row
                className="filter-section"
                gutter={[16, 16]}
                style={{ marginBottom: '24px' }}
                align="middle"
            >
                <Col xs={24} sm={12} md={8}>
                    <Select
                        allowClear
                        placeholder="Filter by Employee"
                        style={{ width: '100%' }}
                        onChange={(value) => setSelectedEmployee(value)}
                        value={selectedEmployee}
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {employees.map(emp => (
                            <Option key={emp._id} value={emp._id}>{emp.name}</Option>
                        ))}
                    </Select>
                </Col>
                {selectedEmployee && (
                    <Col>
                        <Button
                            type="link"
                            onClick={() => setSelectedEmployee(null)}
                        >
                            Clear filter
                        </Button>
                    </Col>
                )}
            </Row>

            <Modal
                title={editingTask ? 'Edit Task' : 'Assign New Task'}
                open={showForm}
                onCancel={resetForm}
                footer={null}
                width="90%"
                style={{ maxWidth: 800 }}
                destroyOnClose
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ priority: 'Medium' }}
                >
                            <Row gutter={[16, 0]}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Task Title"
                                        name="title"
                                        rules={[{ required: true, message: 'Please enter task title' }]}
                                    >
                                        <Input placeholder="Enter task title" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Priority"
                                        name="priority"
                                    >
                                        <Select>
                                            <Option value="Low">Low</Option>
                                            <Option value="Medium">Medium</Option>
                                            <Option value="High">High</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={[16, 0]}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Select Customer"
                                        name="customerId"
                                        rules={[{ required: true, message: 'Please select a customer' }]}
                                    >
                                        <Select
                                            placeholder="Select a customer"
                                            onChange={handleCustomerChange}
                                            showSearch
                                            optionFilterProp="children"
                                        >
                                            {customers.map(customer => (
                                                <Option key={customer._id} value={customer._id}>
                                                    {customer.customerName}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Assign to Employee"
                                        name="employeeId"
                                        rules={[{ required: true, message: 'Please select an employee' }]}
                                    >
                                        <Select
                                            placeholder="Select an employee"
                                            showSearch
                                            optionFilterProp="children"
                                        >
                                            {employees.map(employee => (
                                                <Option key={employee._id} value={employee._id}>
                                                    {employee.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            {customerData && (
                                <Card
                                    title="Customer Information (Auto-filled)"
                                    size="small"
                                    style={{ marginBottom: '16px', backgroundColor: '#f6f8fa' }}
                                >
                                    <Row gutter={[16, 8]}>
                                        <Col xs={24} sm={12} md={8}>
                                            <strong>Customer:</strong> {customerData.customerName}
                                        </Col>
                                        <Col xs={24} sm={12} md={8}>
                                            <strong>Phone:</strong> {customerData.phoneNumber}
                                        </Col>
                                        <Col xs={24} sm={12} md={8}>
                                            <strong>Contractor:</strong> {customerData.contractor?.name || 'N/A'}
                                        </Col>
                                        <Col xs={24} sm={12} md={8}>
                                            <strong>Due Date:</strong> {customerData.dueDate ? new Date(customerData.dueDate).toLocaleDateString() : 'N/A'}
                                        </Col>
                                        <Col xs={24} sm={12} md={8}>
                                            <strong>Amount:</strong> ${customerData.amount}
                                        </Col>
                                        <Col xs={24} sm={12} md={8}>
                                            <strong>Status:</strong> {customerData.status}
                                        </Col>
                                    </Row>
                                </Card>
                            )}

                            <Form.Item
                                label="Description"
                                name="description"
                            >
                                <Input.TextArea rows={3} placeholder="Enter task description" />
                            </Form.Item>

                            <Form.Item
                                label="Notes"
                                name="notes"
                            >
                                <Input.TextArea rows={2} placeholder="Enter any additional notes" />
                            </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={resetForm}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {editingTask ? 'Update Task' : 'Assign Task'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            <Card bodyStyle={{ padding: 0, overflow: 'hidden' }}>
                <div className="responsive-table-wrapper">
                    <Table
                        columns={columns}
                        dataSource={filteredTasks}
                        rowKey="_id"
                        loading={loading}
                        scroll={{ x: 900 }}
                        pagination={{
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} tasks`,
                            responsive: true,
                        }}
                        locale={{
                            emptyText: 'No tasks assigned yet. Click "Assign New Task" to get started.',
                        }}
                    />
                </div>
            </Card>
        </div>
    );
};

export default TaskPage;