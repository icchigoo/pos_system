import React, { createContext, useContext } from "react";
import authenticatedAxios from "../utils/axiosInstance";
import { useAuthContext } from "./AuthContext";
import { base_url } from "../utils/baseUrl";

const UnitContext = createContext();

export const useUnitContext = () => useContext(UnitContext);

export const UnitProvider = ({ children }) => {
  const { user } = useAuthContext();

  const createUnit = async (unitData) => {
    try {
      const response = await authenticatedAxios.post(`${base_url}unit`, unitData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await authenticatedAxios.get(`${base_url}unit`);
      return response.data.units;
    } catch (error) {
      throw  Error(error.response.data.message);
    }
  };

  const deleteUnit = async (unitId) => {
    try {
      const response = await authenticatedAxios.delete(`${base_url}unit/${unitId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const editUnit = async (unitId, updatedUnitData) => {
    try {
      const response = await authenticatedAxios.put(`${base_url}unit/${unitId}`, updatedUnitData, {
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
    <UnitContext.Provider value={{ createUnit, fetchUnits, deleteUnit, editUnit }}>
      {children}
    </UnitContext.Provider>
  );
};
