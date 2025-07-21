import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: true, // ✅ this is mandatory for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
