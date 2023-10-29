import axios from "axios";

const authenticatedAxios = axios.create();

// Add an interceptor to the authenticatedAxios instance to automatically include the token in the request headers
authenticatedAxios.interceptors.request.use(
  (config) => {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authenticatedAxios;
