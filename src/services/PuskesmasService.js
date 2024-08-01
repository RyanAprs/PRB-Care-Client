import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URI = import.meta.env.VITE_API_BASE_URI;

const getToken = () => Cookies.get("token");

const getRequestHeaders = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllPuskesmas = async () => {
  const response = await axios.get(
    `${API_BASE_URI}/api/admin-puskesmas`,
    getRequestHeaders()
  );
  return response.data.data;
};

export const getPuskesmasById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URI}/api/admin-puskesmas/${id}`,
      getRequestHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

export const getCurrentAdminPuskesmas = async () => {
  const response = await axios.get(
    `${API_BASE_URI}/api/admin-puskesmas/current`,
    getRequestHeaders()
  );
  return response.data.data;
};

export const createPuskesmas = async (datas) => {
  const response = await axios.post(
    `${API_BASE_URI}/api/admin-puskesmas`,
    datas,
    getRequestHeaders()
  );
  return response;
};

export const updatePuskesmas = async (id, datas) => {
  const response = await axios.patch(
    `${API_BASE_URI}/api/admin-puskesmas/${id}`,
    datas,
    getRequestHeaders()
  );
  return response;
};

export const deletepuskesmas = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URI}/api/admin-puskesmas/${id}`,
    getRequestHeaders()
  );
  return response;
};
