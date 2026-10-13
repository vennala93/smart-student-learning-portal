import axios from "axios";

const api = axios.create({
  baseURL: "https://YOUR-BACKEND-NAME.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;