import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = {
      status: error?.response?.status ?? null,
      statusCode: error?.response?.data?.statusCode ?? null,
      message: error?.response?.data?.message ?? error?.message ?? "Request failed",
      data: error?.response?.data ?? null,
      originalError: error,
    };

    return Promise.reject(normalizedError);
  }
);

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

  getRolesAll: async () => {
    return await api.get("/api/roles/all");
  },

  getRoleByCode: (code) => {
    return api.get(`/api/roles/by-code?code=${code}`);
  },

  getRoleByName: (name) => {
    return api.get(`/api/roles/by-name?name=${name}`);
  },

  getSpecialtiesAll: () => {
    return api.get("/api/specialties/all");
  },

  getSpecialtyByCode: (code) => {
    return api.get(`/api/specialties/by-code?code=${code}`);
  },

  getSpecialtyByName: (name) => {
    console.log("API 호출 - 전공 이름:", name);
    return api.get(`/api/specialties/by-name?name=${name}`);
  },
};

export default api;
