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

export const getAllPengguna = async () => {
  const response = await axios.get(
    `${API_BASE_URI}/api/pengguna`,
    getRequestHeaders()
  );
  return response.data.data;
};

export const getPenggunaById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URI}/api/pengguna/${id}`,
      getRequestHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

export const createPengguna = async (datas) => {
  const response = await axios.post(
    `${API_BASE_URI}/api/pengguna`,
    datas,
    getRequestHeaders()
  );
  return response;
};

export const updatePengguna = async (id, datas) => {
  const response = await axios.patch(
    `${API_BASE_URI}/api/pengguna/${id}`,
    datas,
    getRequestHeaders()
  );
  return response;
};

export const deletePengguna = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URI}/api/pengguna/${id}`,
    getRequestHeaders()
  );
  return response;
};
