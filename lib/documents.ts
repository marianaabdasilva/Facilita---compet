import axios from "axios";

const documents = axios.create({
  baseURL: "https://projeto-back-ten.vercel.app",
});

documents.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default documents;
