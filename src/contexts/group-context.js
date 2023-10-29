import React, { createContext, useContext } from "react";
import authenticatedAxios from "../utils/axiosInstance";
import { useAuthContext } from "./auth-context";
import { base_url } from "../utils/baseUrl";

const GroupContext = createContext();

export const useGroupContext = () => useContext(GroupContext);

export const GroupProvider = ({ children }) => {
  const { user } = useAuthContext();

  const createGroup = async (groupData) => {
    try {
      const response = await authenticatedAxios.post(`${base_url}group`, groupData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
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
      const response = await authenticatedAxios.delete(`${base_url}group/delete/${groupId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const editGroup = async (groupId, updatedGroupData) => {
    try {
      const response = await authenticatedAxios.put(`${base_url}group/edit/${groupId}`, updatedGroupData, {
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
    <GroupContext.Provider value={{ createGroup, fetchGroups, deleteGroup, editGroup }}>
      {children}
    </GroupContext.Provider>
  );
};
