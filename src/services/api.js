import axios from "axios";

const API = axios.create({
  baseURL: "https://retailstoresystem.onrender.com", // replace with your Render backend URL
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
