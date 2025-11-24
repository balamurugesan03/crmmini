import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select } from "antd";
import employeeService from "../api/employeeService";

export default function EmployeePage() {
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [form] = Form.useForm();

    const loadEmployees = async () => {
        try {
            const res = await employeeService.getAll();
            setData(res?.data || []);
        } catch (error) {
            console.error('Failed to load employees:', error);
            setData([]);
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const handleAddOrUpdate = async () => {
        const values = await form.validateFields();
        if (isEdit) {
            await employeeService.update(currentId, values);
        } else {
            await employeeService.create(values);
        }
        setModalVisible(false);
        form.resetFields();
        setIsEdit(false);
        setCurrentId(null);
        loadEmployees();
    };

    const handleDelete = async (id) => {
        await employeeService.delete(id);
        loadEmployees();
    };

    const handleEdit = (record) => {
        setIsEdit(true);
        setCurrentId(record._id);
        form.setFieldsValue({
            name: record.name,
            status: record.status
        });
        setModalVisible(true);
    };

    const columns = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Status", dataIndex: "status", key: "status" },
        {
            title: "Action",
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                    <Button danger onClick={() => handleDelete(record._id)}>Delete</Button>
                </>
            )
        }
    ];

    return (
        <div>
            <Button
                type="primary"
                onClick={() => {
                    setModalVisible(true);
                    setIsEdit(false);
                    form.resetFields();
                }}
                style={{ marginBottom: "16px" }}
            >
                Add Employee
            </Button>

            <div className="responsive-table-wrapper">
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="_id"
                    scroll={{ x: 500 }}
                    pagination={{ responsive: true }}
                />
            </div>

            <Modal
                title={isEdit ? "Edit Employee" : "Add Employee"}
                open={modalVisible}
                onOk={handleAddOrUpdate}
                onCancel={() => setModalVisible(false)}
                width="90%"
                style={{ maxWidth: 500 }}
                centered
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="Active">Active</Select.Option>
                            <Select.Option value="Inactive">Inactive</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
