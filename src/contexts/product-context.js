import React, { createContext, useContext } from "react";
import authenticatedAxios from "../utils/axiosInstance";
import { useAuthContext } from "./auth-context";
import { base_url } from "../utils/baseUrl";

const ProductContext = createContext();

export const useProductContext = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const { user } = useAuthContext();

  const createProduct = async (productData) => {
    try {
      const response = await authenticatedAxios.post(`${base_url}product`, productData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await authenticatedAxios.get(`${base_url}product`);
      return response.data.products;
    } catch (error) {
      throw  Error(error.response.data.message);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await authenticatedAxios.delete(`${base_url}product/${productId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const editProduct = async (productId, updatedProductData) => {
    try {
      const response = await authenticatedAxios.put(`${base_url}product/${productId}`, updatedProductData, {
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
    <ProductContext.Provider value={{ createProduct, fetchProducts, deleteProduct, editProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
