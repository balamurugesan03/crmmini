import apiClient from "./apiClient";

const taskService = {
    getAll: () => apiClient.get("/tasks"),
    getById: (id) => apiClient.get(`/tasks/${id}`),
    create: (data) => apiClient.post("/tasks", data),
    update: (id, data) => apiClient.put(`/tasks/${id}`, data),
    delete: (id) => apiClient.delete(`/tasks/${id}`),
    getByEmployee: (employeeId) => apiClient.get(`/tasks/employee/${employeeId}`),
    getByCustomer: (customerId) => apiClient.get(`/tasks/customer/${customerId}`),
    getCustomerForAssignment: (customerId) => apiClient.get(`/tasks/customer-data/${customerId}`)
};

export default taskService;