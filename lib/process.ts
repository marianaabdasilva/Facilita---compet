import axios from "axios";

const process = axios.create({
  baseURL: "https://projeto-back-ten.vercel.app",
});

process.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default process;
