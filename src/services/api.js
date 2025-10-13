import axios from "axios";

const isLocalhost = window.location.hostname === "localhost";

const API = axios.create({
  baseURL: isLocalhost
    ? "http://localhost:5000/api" // Local backend URL
    : "https://retail-backend-7mx2.onrender.com/api", // Render backend URL
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
