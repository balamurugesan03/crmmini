import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber, Checkbox, Select, Row, Col, message, Tabs } from "antd";
import customerService from "../api/customerService";
import contractorService from "../api/contractorService";
import dayjs from "dayjs";

export default function CustomerPage() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [viewingCustomer, setViewingCustomer] = useState(null);
    const [contractors, setContractors] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [contractorFilter, setContractorFilter] = useState('');
    const [form] = Form.useForm();

    const loadCustomers = async () => {
        try {
            const res = await customerService.getAll();
            setData(res?.data || []);
            setFilteredData(res?.data || []);
        } catch (error) {
            console.error('Failed to load customers:', error);
            setData([]);
            setFilteredData([]);
        }
    };

    const loadContractors = async () => {
        try {
            const res = await contractorService.getAll();
            setContractors(res?.data || []);
        } catch (error) {
            console.error('Failed to load contractors:', error);
            setContractors([]);
        }
    };

    useEffect(() => {
        loadCustomers();
        loadContractors();
    }, []);

    const calculateDueDate = (today, dueDays) => {
        if (!today || dueDays == null) return null;
        return dayjs(today).add(dueDays, 'day');
    };

    const handleAddOrUpdate = async () => {
        try {
            const values = await form.validateFields();

            // Auto calculate balance
            const amount = values.amount || 0;
            const advance = values.advance || 0;
            const part01 = values.part01 || 0;
            const part02 = values.part02 || 0;
            values.balance = amount - advance - part01 - part02;

            // Convert dates to ISO string
            if (values.todayDate) values.todayDate = values.todayDate.toISOString();
            if (values.dueDate) values.dueDate = values.dueDate.toISOString();

            if (isEdit) {
                await customerService.update(currentId, values);
                message.success("Customer updated successfully");
            } else {
                await customerService.create(values);
                message.success("Customer created successfully");
            }

            setModalVisible(false);
            form.resetFields();
            setIsEdit(false);
            setCurrentId(null);
            loadCustomers();
        } catch (error) {
            console.error(error);
            message.error("Operation failed");
        }
    };

    const handleEdit = (record) => {
        setIsEdit(true);
        setCurrentId(record._id);
        const contractorIdValue = typeof record.contractorId === 'object' && record.contractorId._id 
            ? record.contractorId._id 
            : record.contractorId;
        form.setFieldsValue({
            ...record,
            contractorId: contractorIdValue,
            todayDate: record.todayDate ? dayjs(record.todayDate) : dayjs(),
            dueDate: record.dueDate ? dayjs(record.dueDate) : null
        });
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        await customerService.delete(id);
        loadCustomers();
    };

    const applyFilters = () => {
        let filtered = [...data];
        if (statusFilter) filtered = filtered.filter(c => c.status === statusFilter);
        if (contractorFilter) {
            filtered = filtered.filter(c => {
                const contractorId = typeof c.contractorId === 'object' && c.contractorId._id 
                    ? c.contractorId._id 
                    : c.contractorId;
                return contractorId === contractorFilter;
            });
        }
        setFilteredData(filtered);
    };

    useEffect(() => { applyFilters(); }, [statusFilter, contractorFilter, data]);

    const clearFilters = () => { setStatusFilter(''); setContractorFilter(''); };

    const handleView = (record) => { setViewingCustomer(record); setViewModalVisible(true); };

    const handleStatusChange = async (customerId, newStatus) => {
        try { await customerService.update(customerId, { status: newStatus }); loadCustomers(); }
        catch (error) { console.error('Error updating status:', error); }
    };

    const getSelectedServices = (customer) => {
        const selectedServices = [];
        
        // Check exterior services
        if (customer.services?.exteriorElevation) {
            selectedServices.push("Exterior Elevation");
            if (customer.services.exteriorElevationCount) {
                selectedServices.push(`Count: ${customer.services.exteriorElevationCount}`);
            }
        }
        if (customer.services?.exteriorDimensions) {
            selectedServices.push("Exterior Dimensions");
        }
        
        // Check interior services
        if (customer.services?.interiorWalkthrough) {
            selectedServices.push("Interior Walkthrough");
            if (customer.services.interiorWalkthroughCategory) {
                selectedServices.push(`Category: ${customer.services.interiorWalkthroughCategory}`);
            }
        }
        if (customer.services?.bathroomDesign) selectedServices.push("Bathroom Design");
        if (customer.services?.showElectricalPoint) selectedServices.push("Show Electrical Point");
        if (customer.services?.interiorRenderImages) {
            selectedServices.push("Interior Render Images");
            if (customer.services.interiorRenderNotes) {
                selectedServices.push(`Notes: ${customer.services.interiorRenderNotes}`);
            }
        }
        if (customer.services?.interiorDimensions) selectedServices.push("Interior Dimensions");
        
        // Check isometric view
        if (customer.services?.isometricView) selectedServices.push("Isometric View");
        
        // Check layout walkthrough
         if (customer.services?.layoutWalkthroughAndImages) {
        selectedServices.push("Layout Walkthrough Images");
    }
        
        // Check architectural drawings
        const archDrawings = customer.architecturalDrawing || {};
        const drawingLabels = {
            floorPlan: "Floor Plan",
            elevation: "Elevation",
            electricalPlan: "Electrical Plan",
            furniturePlan: "Furniture Plan",
            plumbingPlan: "Plumbing Plan",
            structuralPlan: "Structural Plan"
        };
        
        Object.keys(drawingLabels).forEach(key => {
            if (archDrawings[key]) {
                selectedServices.push(drawingLabels[key]);
            }
        });
        
        if (archDrawings.notes) {
            selectedServices.push(`Architectural Notes: ${archDrawings.notes}`);
        }
        
        return selectedServices;
    };

    const columns = [
        { title: "Customer Name", dataIndex: "customerName" },
        { title: "Contractor Name", dataIndex: "contractorId",
          render: (contractorId) => {
              if (!contractorId) return 'Not Assigned';
              if (typeof contractorId === 'object' && contractorId.name) return contractorId.name;
              const contractor = contractors.find(c => c._id === contractorId);
              return contractor?.name || 'Contractor Not Found';
          }
        },
        { title: "Amount", dataIndex: "amount" },
        { title: "Advance", dataIndex: "advance" },
        { title: "Balance", dataIndex: "balance" },
        { title: "Status", dataIndex: "status",
          render: (status, record) => (
              <Select value={status} onChange={(val) => handleStatusChange(record._id, val)} style={{ width: 120 }}>
                  <Select.Option value="New">New</Select.Option>
                  <Select.Option value="Process">Process</Select.Option>
                  <Select.Option value="Correction">Correction</Select.Option>
                  <Select.Option value="Payment">Payment</Select.Option>
                  <Select.Option value="Finished">Finished</Select.Option>
              </Select>
          )
        },
        { title: "Action", render: (_, record) => (
            <>
                <Button type="link" onClick={() => handleView(record)}>View</Button>
                <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                <Button danger onClick={() => handleDelete(record._id)}>Delete</Button>
            </>
        )}
    ];

    return (
        <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: "20px"
            }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={12} md={6}>
                        <Button
                            type="primary"
                            onClick={() => { setModalVisible(true); setIsEdit(false); form.resetFields(); }}
                            style={{
                                backgroundColor: '#1890ff',
                                borderColor: '#1890ff',
                                borderRadius: '6px',
                                height: '40px',
                                fontWeight: '500',
                                width: '100%'
                            }}
                        >
                            Add Customer
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Filter by Status"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{
                                width: '100%',
                                borderRadius: '6px'
                            }}
                            allowClear
                        >
                            <Select.Option value="New">New</Select.Option>
                            <Select.Option value="Process">Process</Select.Option>
                            <Select.Option value="Correction">Correction</Select.Option>
                            <Select.Option value="Payment">Payment</Select.Option>
                            <Select.Option value="Finished">Finished</Select.Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Select
                            placeholder="Filter by Contractor"
                            value={contractorFilter}
                            onChange={setContractorFilter}
                            style={{
                                width: '100%',
                                borderRadius: '6px'
                            }}
                            allowClear
                        >
                            {contractors.map(c => <Select.Option key={c._id} value={c._id}>{c.name}</Select.Option>)}
                        </Select>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Button
                            onClick={clearFilters}
                            style={{
                                borderRadius: '6px',
                                height: '32px',
                                borderColor: '#d9d9d9',
                                color: '#595959',
                                width: '100%'
                            }}
                        >
                            Clear Filters
                        </Button>
                    </Col>
                </Row>
            </div>

            <div style={{
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
                <div className="responsive-table-wrapper">
                    <Table
                        dataSource={filteredData}
                        columns={columns}
                        rowKey="_id"
                        scroll={{ x: 900 }}
                        style={{
                            borderRadius: '8px'
                        }}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} customers`,
                            responsive: true
                        }}
                    />
                </div>
            </div>

            {/* Add / Edit Modal */}
            <Modal
                title={isEdit ? "Edit Customer" : "Add Customer"}
                open={modalVisible}
                onOk={handleAddOrUpdate}
                onCancel={() => setModalVisible(false)}
                width="95%"
                style={{ maxWidth: 1000 }}
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onValuesChange={(changedValues, allValues) => {
                        if (changedValues.dueDays !== undefined || changedValues.todayDate !== undefined) {
                            const today = allValues.todayDate || dayjs();
                            const dueDays = allValues.dueDays || 0;
                            const newDueDate = calculateDueDate(today, dueDays);
                            form.setFieldsValue({ dueDate: newDueDate });
                        }

                        // Auto-calculate balance
                        const amount = allValues.amount || 0;
                        const advance = allValues.advance || 0;
                        form.setFieldsValue({ balance: amount - advance });
                    }}
                >
                    <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12} md={8}><Form.Item name="customerName" label="Customer Name" rules={[{ required: true }]}><Input /></Form.Item></Col>
                        <Col xs={24} sm={12} md={8}><Form.Item name="contractorId" label="Contractor Name" rules={[{ required: true }]}><Select placeholder="Select Contractor">{contractors.map(c => <Select.Option key={c._id} value={c._id}>{c.name}</Select.Option>)}</Select></Form.Item></Col>
                        <Col xs={24} sm={12} md={8}><Form.Item name="phoneNumber" label="Phone Number"><Input /></Form.Item></Col>
                    </Row>

                    <Row gutter={[16, 0]}>
                        <Col xs={12} sm={12} md={6}><Form.Item name="dueDays" label="Due Days"><InputNumber style={{ width: "100%" }} /></Form.Item></Col>
                        <Col xs={12} sm={12} md={6}><Form.Item name="todayDate" label="Today Date"><DatePicker style={{ width: "100%" }} /></Form.Item></Col>
                        <Col xs={12} sm={12} md={6}><Form.Item name="dueDate" label="Due Date"><DatePicker style={{ width: "100%" }} disabled /></Form.Item></Col>
                        <Col xs={12} sm={12} md={6}><Form.Item name="status" label="Status"><Select><Select.Option value="New">New</Select.Option><Select.Option value="Process">Process</Select.Option><Select.Option value="Correction">Correction</Select.Option><Select.Option value="Payment">Payment</Select.Option><Select.Option value="Finished">Finished</Select.Option></Select></Form.Item></Col>
                    </Row>

                    <Row gutter={[16, 0]}>
                        <Col xs={12} sm={8} md={4}><Form.Item name="amount" label="Amount"><InputNumber style={{ width: "100%" }} /></Form.Item></Col>
                        <Col xs={12} sm={8} md={4}><Form.Item name="advance" label="Advance"><InputNumber style={{ width: "100%" }} /></Form.Item></Col>
                        <Col xs={12} sm={8} md={4}><Form.Item name="part01" label="Part-01"><InputNumber style={{ width: "100%" }} /></Form.Item></Col>
                        <Col xs={12} sm={8} md={4}><Form.Item name="part02" label="Part-02"><InputNumber style={{ width: "100%" }} /></Form.Item></Col>
                        <Col xs={12} sm={8} md={4}><Form.Item name="balance" label="Balance"><InputNumber style={{ width: "100%" }} disabled /></Form.Item></Col>
                    </Row>
                    
                    <Tabs
                        defaultActiveKey="1"
                        type="card"
                        items={[
                            {
                                key: '1',
                                label: 'Exterior Service',
                                children: (
                                    <>
                                        <Row gutter={16}>
                                            <Col span={12}><Form.Item name={['services','exteriorElevation']} valuePropName="checked"><Checkbox>Exterior Elevation</Checkbox></Form.Item></Col>
                                            <Col span={12}><Form.Item name={['services','exteriorElevationCount']}><InputNumber min={0} placeholder="Count" /></Form.Item></Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col span={12}><Form.Item name={['services','exteriorDimensions']} valuePropName="checked"><Checkbox>Exterior Dimensions</Checkbox></Form.Item></Col>
                                        </Row>
                                    </>
                                )
                            },
                            {
                                key: '2',
                                label: 'Interior Service',
                                children: (
                                    <>
                                        <Row gutter={16}>
                                            <Col span={12}><Form.Item name={['services','interiorWalkthrough']} valuePropName="checked"><Checkbox>Interior Walkthrough</Checkbox></Form.Item></Col>
                                            <Col span={12}><Form.Item name={['services','interiorWalkthroughCategory']}><Select placeholder="Select category">
                                                <Select.Option value="Category1">Category 1</Select.Option>
                                                <Select.Option value="Category2">Category 2</Select.Option>
                                            </Select></Form.Item></Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col span={12}><Form.Item name={['services','bathroomDesign']} valuePropName="checked"><Checkbox>Bathroom Design</Checkbox></Form.Item></Col>
                                            <Col span={12}><Form.Item name={['services','showElectricalPoint']} valuePropName="checked"><Checkbox>Show Electrical Point</Checkbox></Form.Item></Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col span={12}><Form.Item name={['services','interiorRenderImages']} valuePropName="checked"><Checkbox>Interior Render Images</Checkbox></Form.Item></Col>
                                            <Col span={12}><Form.Item name={['services','interiorRenderNotes']}><Input placeholder="Notes" /></Form.Item></Col>
                                        </Row>
                                        <Form.Item name={['services','interiorDimensions']} valuePropName="checked"><Checkbox>Interior Dimensions</Checkbox></Form.Item>
                                    </>
                                )
                            },
                            {
                                key: '4',
                                label: 'Isometric View',
                                children: (
                                    <>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item name={['services','isometricView']} valuePropName="checked">
                                                    <Checkbox>Isometric View</Checkbox>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </>
                                )
                            },
                          {
    key: '5',
    label: 'Layout Walkthrough',
    children: (
        <>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name={['services','layoutWalkthroughAndImages']} valuePropName="checked">
                        <Checkbox>Layout Walkthrough Images</Checkbox>
                    </Form.Item>
                </Col>
            </Row>
        </>
    )
},
                            {
                                key: '3',
                                label: 'Architectural Drawing',
                                children: (
                                    <>
                                        <Row gutter={16}>
                                            {['floorPlan','elevation','electricalPlan','furniturePlan','plumbingPlan','structuralPlan'].map(f => (
                                                <Col span={8} key={f}>
                                                    <Form.Item name={['architecturalDrawing',f]} valuePropName="checked">
                                                        <Checkbox>{f.replace(/([A-Z])/g," $1")}</Checkbox>
                                                    </Form.Item>
                                                </Col>
                                            ))}
                                        </Row>
                                        <Form.Item name={['architecturalDrawing','notes']}><Input placeholder="Notes" /></Form.Item>
                                    </>
                                )
                            }
                        ]}
                    />
                    
                    <Form.Item name="notes" label="General Notes"><Input.TextArea rows={3} /></Form.Item>
                </Form>
            </Modal>

            {/* View Modal */}
            <Modal title="Customer Details" open={viewModalVisible} onCancel={() => setViewModalVisible(false)} footer={null} width="95%" style={{ maxWidth: 1000 }} centered>
                {viewingCustomer && (
                    <div>
                        <Row gutter={[16, 8]}>
                            <Col xs={24} sm={12} md={8}><p><strong>Customer Name:</strong> {viewingCustomer.customerName}</p></Col>
                            <Col xs={24} sm={12} md={8}><p><strong>Contractor Name:</strong> {typeof viewingCustomer.contractorId === 'object' ? viewingCustomer.contractorId.name : contractors.find(c => c._id===viewingCustomer.contractorId)?.name || 'Not Assigned'}</p></Col>
                            <Col xs={24} sm={12} md={8}><p><strong>Phone:</strong> {viewingCustomer.phoneNumber}</p></Col>
                        </Row>
                        <Row gutter={[16, 8]}>
                            <Col xs={12} sm={12} md={6}><p><strong>Due Days:</strong> {viewingCustomer.dueDays}</p></Col>
                            <Col xs={12} sm={12} md={6}><p><strong>Today Date:</strong> {viewingCustomer.todayDate ? dayjs(viewingCustomer.todayDate).format('YYYY-MM-DD') : 'N/A'}</p></Col>
                            <Col xs={12} sm={12} md={6}><p><strong>Due Date:</strong> {viewingCustomer.dueDate ? dayjs(viewingCustomer.dueDate).format('YYYY-MM-DD') : 'N/A'}</p></Col>
                            <Col xs={12} sm={12} md={6}><p><strong>Status:</strong> {viewingCustomer.status}</p></Col>
                        </Row>
                        <Row gutter={[16, 8]}>
                            <Col xs={12} sm={8} md={4}><p><strong>Amount:</strong> {viewingCustomer.amount || 'N/A'}</p></Col>
                            <Col xs={12} sm={8} md={4}><p><strong>Advance:</strong> {viewingCustomer.advance || 'N/A'}</p></Col>
                            <Col xs={12} sm={8} md={4}><p><strong>Part-01:</strong> {viewingCustomer.part01 || 'N/A'}</p></Col>
                            <Col xs={12} sm={8} md={4}><p><strong>Part-02:</strong> {viewingCustomer.part02 || 'N/A'}</p></Col>
                            <Col xs={12} sm={8} md={4}><p><strong>Balance:</strong> {viewingCustomer.balance || 'N/A'}</p></Col>
                        </Row>

                        <h4>Selected Services</h4>
                        {getSelectedServices(viewingCustomer).length > 0 ? (
                            <ul>
                                {getSelectedServices(viewingCustomer).map((service, index) => (
                                    <li key={index}>{service}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No services selected</p>
                        )}

                        {viewingCustomer.notes && (
                            <Row gutter={[16, 8]}>
                                <Col span={24}>
                                    <p><strong>General Notes:</strong> {viewingCustomer.notes}</p>
                                </Col>
                            </Row>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}