import axios from "axios";

const instance = axios.create();

// Add an interceptor to modify the request before it's sent
instance.interceptors.request.use(
  (axiosConfig) => {
    const user = JSON.parse(localStorage.getItem("user"));

    // Add authentication headers if user is logged in
    if (user && user.token) {
      axiosConfig.headers.Authorization = `Bearer ${user.token}`;
    }

    // Always set the Accept header for JSON responses
    axiosConfig.headers.Accept = "application/json";

    return axiosConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
