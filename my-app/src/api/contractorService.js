import apiClient from "./apiClient";

const contractorService = {
    getAll: () => apiClient.get("/contractors"),
    create: (data) => apiClient.post("/contractors", data),
    update: (id, data) => apiClient.put(`/contractors/${id}`, data),
    delete: (id) => apiClient.delete(`/contractors/${id}`)
};

export default contractorService;
