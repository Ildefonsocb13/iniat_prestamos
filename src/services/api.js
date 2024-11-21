import axios from "axios";

// Configuración base de Axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api", // URL base para todas las peticiones
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptores para manejar errores o añadir lógica global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo de errores
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default api;
