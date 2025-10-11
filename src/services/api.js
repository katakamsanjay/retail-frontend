// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api", // replace with your Render backend URL
// });

// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) req.headers.Authorization = `Bearer ${token}`;
//   return req;
// });

// export default API;


import axios from "axios";

const API = axios.create({
  baseURL: "https://retail-backend-7mx2.onrender.com/api", // <-- deployed backend URL
});

export default API;
