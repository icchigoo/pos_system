import axios from "axios";


const authenticatedAxios = axios.create();

authenticatedAxios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(window.localStorage.getItem("user"));
    console.log("User in axios instance interceptor:", user);

    const token = user ? user.token : null;
    console.log("Token in axios instance interceptor:", token);

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
