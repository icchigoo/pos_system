import React, { createContext, useContext } from "react";
import authenticatedAxios from "../utils/axiosInstance";
import { useAuthContext } from "./AuthContext";
import { base_url } from "../utils/baseUrl";

const GroupContext = createContext();

export const useGroupContext = () => useContext(GroupContext);

export const GroupProvider = ({ children }) => {
  const { user } = useAuthContext();

  const createGroup = async (groupData) => {
    try {
      const response = await authenticatedAxios.post(`${base_url}group`, groupData, {});
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await authenticatedAxios.get(`${base_url}group`);
      return response.data.groups;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      const response = await authenticatedAxios.delete(`${base_url}group/${groupId}`, {});
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const editGroup = async (groupId, updatedGroupData) => {
    try {
      const response = await authenticatedAxios.put(
        `${base_url}group/${groupId}`,
        updatedGroupData,
        {}
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  return (
    <GroupContext.Provider value={{ createGroup, fetchGroups, deleteGroup, editGroup }}>
      {children}
    </GroupContext.Provider>
  );
};
