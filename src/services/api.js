import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiService = {
    login: async (payload) => {
        return await api.post("/api/users/login", payload);
    },

    doctorRegister: async (payload) => {
        return await api.post("/api/doctors/register", payload);
    },

    patientRegister: async (payload) => {
        return await api.post("/api/patients/register", payload);
    },

    getRolesAll: () => {
        return api.get("/api/roles/all");
    },

    getRoleByCode: (code) => {
        return api.get(`/api/roles/${code}`);
    },

    getSpecialtiesAll: () => {
        return api.get("/api/specialties/all");
    },

    getSpecialtyByCode: (code) => {
        return api.get(`/api/specialties/${code}`);
    }
}

export default api;
