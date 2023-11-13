import React, { createContext, useContext } from "react";
import authenticatedAxios from "../utils/axiosInstance";
import { useAuthContext } from "./auth-context";
import { base_url } from "../utils/baseUrl";

const StockAdjustmentContext = createContext();

export const useStockAdjustmentContext = () => useContext(StockAdjustmentContext);

export const StockAdjustmentProvider = ({ children }) => {
  const { user } = useAuthContext();

  const createStockAdjustment = async (stockAdjustmentData) => {
    try {
      const response = await authenticatedAxios.post(
        `${base_url}stock`,
        stockAdjustmentData,
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

  const fetchStockAdjustments = async () => {
    try {
      const response = await authenticatedAxios.get(`${base_url}stock`);
      return response.data.stock_adjustments;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const deleteStockAdjustment = async (stockAdjustmentId) => {
    try {
      const response = await authenticatedAxios.delete(
        `${base_url}stock/${stockAdjustmentId}`,
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

  const editStockAdjustment = async (stockAdjustmentId, updatedStockAdjustmentData) => {
    try {
      const response = await authenticatedAxios.put(
        `${base_url}stock/${stockAdjustmentId}`,
        updatedStockAdjustmentData,
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
    <StockAdjustmentContext.Provider
      value={{
        createStockAdjustment,
        fetchStockAdjustments,
        deleteStockAdjustment,
        editStockAdjustment,
      }}
    >
      {children}
    </StockAdjustmentContext.Provider>
  );
};
