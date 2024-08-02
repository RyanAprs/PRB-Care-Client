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

export const getAllApotek = async () => {
  const response = await axios.get(
    `${API_BASE_URI}/api/admin-apotek`,
    getRequestHeaders()
  );
  return response.data.data;
};

export const getApotekById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URI}/api/admin-apotek/${id}`,
      getRequestHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

export const createApotek = async (datas) => {
  const response = await axios.post(
    `${API_BASE_URI}/api/admin-apotek`,
    datas,
    getRequestHeaders()
  );
  return response;
};

export const updateApotek = async (id, datas) => {
  const response = await axios.patch(
    `${API_BASE_URI}/api/admin-apotek/${id}`,
    datas,
    getRequestHeaders()
  );
  return response;
};

export const deleteApotek = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URI}/api/admin-apotek/${id}`,
    getRequestHeaders()
  );
  return response;
};
