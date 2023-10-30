import React, { createContext, useContext } from "react";
import authenticatedAxios from "../utils/axiosInstance";
import { useAuthContext } from "./auth-context";
import { base_url } from "../utils/baseUrl";

const CategoryContext = createContext();

export const useCategoryContext = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const { user } = useAuthContext();

  const createCategory = async (categoryData) => {
    try {
      const response = await authenticatedAxios.post(
        `${base_url}category`,
        categoryData,
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

  const fetchCategories = async () => {
    try {
      const response = await authenticatedAxios.get(`${base_url}category`);
      return response.data.categories;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const response = await authenticatedAxios.delete(
        `${base_url}category/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw  Error(error.response.data.message);
    }
  };

  const editCategory = async (categoryId, updatedCategoryData) => {
    try {
      const response = await authenticatedAxios.put(
        `${base_url}category/${categoryId}`,
        updatedCategoryData,
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
    <CategoryContext.Provider
      value={{ createCategory, fetchCategories, deleteCategory, editCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
