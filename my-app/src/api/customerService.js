import apiClient from "./apiClient";

const customerService = {
    getAll: () => apiClient.get("/customers"),
    create: (data) => apiClient.post("/customers", data),
    update: (id, data) => apiClient.put(`/customers/${id}`, data),
    delete: (id) => apiClient.delete(`/customers/${id}`)
};

export default customerService;
