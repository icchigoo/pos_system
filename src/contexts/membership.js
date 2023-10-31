import React, { createContext, useContext } from "react";
import authenticatedAxios from "../utils/axiosInstance";
import { useAuthContext } from "./auth-context";
import { base_url } from "../utils/baseUrl";

const MembershipContext = createContext();

export const useMembershipContext = () => useContext(MembershipContext);

export const MembershipProvider = ({ children }) => {
  const { user } = useAuthContext();

  const createMembership = async (membershipData) => {
    try {
      const response = await authenticatedAxios.post(`${base_url}membershipType`, membershipData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const fetchMemberships = async () => {
    try {
      const response = await authenticatedAxios.get(`${base_url}membershipType`);
      return response.data.membershipTypes;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const deleteMembership = async (membershipId) => {
    try {
      const response = await authenticatedAxios.delete(`${base_url}membershipType/${membershipId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const editMembership = async (membershipId, updatedMembershipData) => {
    try {
      const response = await authenticatedAxios.put(`${base_url}membershipType/${membershipId}`, updatedMembershipData, {
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
    <MembershipContext.Provider value={{ createMembership, fetchMemberships, deleteMembership, editMembership }}>
      {children}
    </MembershipContext.Provider>
  );
};
