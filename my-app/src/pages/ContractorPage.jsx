import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select } from "antd";
import contractorService from "../api/contractorService";

export default function ContractorPage() {
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [form] = Form.useForm();

    const loadContractors = async () => {
        try {
            const res = await contractorService.getAll();
            setData(res?.data || []);
        } catch (error) {
            console.error('Failed to load contractors:', error);
            setData([]);
        }
    };

    useEffect(() => {
        loadContractors();
    }, []);

    const handleAddOrUpdate = async () => {
        const values = await form.validateFields();
        if (isEdit) {
            await contractorService.update(currentId, values);
        } else {
            await contractorService.create(values);
        }
        setModalVisible(false);
        form.resetFields();
        setIsEdit(false);
        setCurrentId(null);
        loadContractors();
    };

    const handleDelete = async (id) => {
        await contractorService.delete(id);
        loadContractors();
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
                Add Contractor
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
                title={isEdit ? "Edit Contractor" : "Add Contractor"}
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
