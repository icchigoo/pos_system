import React, { createContext, useContext } from "react";
import authenticatedAxios from "../utils/axiosInstance";
import { useAuthContext } from "./AuthContext";
import { base_url } from "../utils/baseUrl";

const CompanyContext = createContext();

export const useCompanyContext = () => useContext(CompanyContext);

export const CompanyProvider = ({ children }) => {
  const { user } = useAuthContext();

  const createCompany = async (companyData) => {
    try {
      const response = await authenticatedAxios.post(`${base_url}company`, companyData, {});
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await authenticatedAxios.get(`${base_url}company`);
      return response.data.companies;
    } catch (error) {
      throw Error(error.response.data.message);
    }
  };

  const deleteCompany = async (companyId) => {
    try {
      const response = await authenticatedAxios.delete(`${base_url}company/${companyId}`, {});
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const editCompany = async (companyId, updatedCompanyData) => {
    try {
      const response = await authenticatedAxios.put(
        `${base_url}company/${companyId}`,
        updatedCompanyData,
        {}
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  return (
    <CompanyContext.Provider value={{ createCompany, fetchCompanies, deleteCompany, editCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};
