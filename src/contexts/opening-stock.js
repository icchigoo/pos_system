import React, { createContext, useContext } from "react";
import authenticatedAxios from "../utils/axiosInstance";
import { useAuthContext } from "./auth-context";
import { base_url } from "../utils/baseUrl";

const OpeningStockContext = createContext();

export const useOpeningStockContext = () => useContext(OpeningStockContext);

export const OpeningStockProvider = ({ children }) => {
  const { user } = useAuthContext();

  const createOpeningStock = async (openingStockData) => {
    try {
      const response = await authenticatedAxios.post(
        `${base_url}opening-stock`,
        openingStockData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const fetchOpeningStockEntries = async () => {
    try {
      const response = await authenticatedAxios.get(`${base_url}opening-stock`);
      return response.data.openingStockEntries;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const deleteOpeningStock = async (openingStockId) => {
    try {
      const response = await authenticatedAxios.delete(
        `${base_url}opening-stock/${openingStockId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const editOpeningStock = async (openingStockId, updatedOpeningStockData) => {
    try {
      const response = await authenticatedAxios.put(
        `${base_url}opening-stock/${openingStockId}`,
        updatedOpeningStockData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  return (
    <OpeningStockContext.Provider
      value={{
        createOpeningStock,
        fetchOpeningStockEntries,
        deleteOpeningStock,
        editOpeningStock,
      }}
    >
      {children}
    </OpeningStockContext.Provider>
  );
};
