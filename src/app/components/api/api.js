import axios from "axios";

// Create one Axios instance
// All API requests will use this base URL
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Export Axios instance
export default api;