import React, { createContext, useContext } from "react";
import authenticatedAxios from "../utils/axiosInstance";
import { useAuthContext } from "./auth-context";
import { base_url } from "../utils/baseUrl";

const TaxContext = createContext();

export const useTaxContext = () => useContext(TaxContext);

export const TaxProvider = ({ children }) => {
  const { user } = useAuthContext();

  const createTax = async (taxData) => {
    try {
      const response = await authenticatedAxios.post(`${base_url}tax`, taxData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const fetchTaxes = async () => {
    try {
      const response = await authenticatedAxios.get(`${base_url}tax`);
      return response.data.taxes;
    } catch (error) {
      throw  Error(error.response.data.message);
    }
  };

  const deleteTax = async (taxId) => {
    try {
      const response = await authenticatedAxios.delete(`${base_url}tax/${taxId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const editTax = async (taxId, updatedTaxData) => {
    try {
      const response = await authenticatedAxios.put(`${base_url}tax/${taxId}`, updatedTaxData, {
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
    <TaxContext.Provider value={{ createTax, fetchTaxes, deleteTax, editTax }}>
      {children}
    </TaxContext.Provider>
  );
};
