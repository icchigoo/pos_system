import React, { createContext, useContext } from "react";
import authenticatedAxios from "../utils/axiosInstance";
import { useAuthContext } from "./AuthContext";
import { base_url } from "../utils/baseUrl";

const SalesContext = createContext();

export const useSalesContext = () => useContext(SalesContext);

export const SalesProvider = ({ children }) => {
  const { user } = useAuthContext();

  const createSale = async (saleData) => {
    try {
      const response = await authenticatedAxios.post(`${base_url}sales`, saleData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const fetchSales = async () => {
    try {
      const response = await authenticatedAxios.get(`${base_url}sales`);
      return response.data.sales;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const deleteSale = async (saleId) => {
    try {
      const response = await authenticatedAxios.delete(`${base_url}sales/${saleId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const editSale = async (saleId, updatedSaleData) => {
    try {
      const response = await authenticatedAxios.put(`${base_url}sales/${saleId}`, updatedSaleData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  return (
    <SalesContext.Provider value={{ createSale, fetchSales, deleteSale, editSale }}>
      {children}
    </SalesContext.Provider>
  );
};
