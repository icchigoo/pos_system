import React, { createContext, useContext } from "react";
import authenticatedAxios from "../utils/axiosInstance";
import { useAuthContext } from "./auth-context";
import { base_url } from "../utils/baseUrl";

// Create a Supplier Context
const SupplierContext = createContext();

// Create a custom hook to use the Supplier Context
export const useSupplierContext = () => useContext(SupplierContext);

// Create a Supplier Provider
export const SupplierProvider = ({ children }) => {
  // Access user information from the Auth Context
  const { user } = useAuthContext();

  // Define CRUD operations for suppliers
  const createSupplier = async (supplierData) => {
    try {
      const response = await authenticatedAxios.post(`${base_url}supplier`, supplierData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await authenticatedAxios.get(`${base_url}supplier`);
      return response.data.suppliers;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const deleteSupplier = async (supplierId) => {
    try {
      const response = await authenticatedAxios.delete(`${base_url}supplier/${supplierId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const editSupplier = async (supplierId, updatedSupplierData) => {
    try {
      const response = await authenticatedAxios.put(`${base_url}supplier/${supplierId}`, updatedSupplierData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  // Provide the SupplierContext with the CRUD operations
  return (
    <SupplierContext.Provider value={{ createSupplier, fetchSuppliers, deleteSupplier, editSupplier }}>
      {children}
    </SupplierContext.Provider>
  );
};
