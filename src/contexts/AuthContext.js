import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { base_url } from "../utils/baseUrl";
import instance from "../utils/axiosInstance";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        // Check if parsedUser is not undefined before setting it
        if (parsedUser) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error parsing user from local storage:", error);
      }
    }
  }, []);

 // Update login function to handle tokens if your backend uses them
const login = async (userData) => {
  try {
    const response = await axios.post(`${base_url}user/login`, userData);
    const loggedInUser = response.data;

    // Check if the user has an "admin" role
    if (loggedInUser.role === "admin") {
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      
      // Assuming your backend returns a token, you can store it in session storage
      localStorage.setItem("token", loggedInUser.token);

      return loggedInUser;
    } else {
      throw new Error("Only administrators are allowed to log in.");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};


  const createUser = async (newUserData) => {
    try {
      const response = await instance.post(`${base_url}user/register`, newUserData);
      const createdUser = response.data;
      setUser(createdUser);
      localStorage.setItem("user", JSON.stringify(createdUser));
      return createdUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error logging out:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, createUser }}>
      {children}
    </AuthContext.Provider>
  );
};
