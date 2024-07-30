import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URI = import.meta.env.VITE_API_BASE_URI;

const token = Cookies.get("token");

export const getAllObat = async () => {
  const response = await axios.get(`${API_BASE_URI}/api/obat`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

export const getObatById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URI}/api/obat/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

export const createObat = async (datas) => {
  const response = await axios.post(`${API_BASE_URI}/api/obat`, datas, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const updateObat = async (id, datas) => {
  const response = await axios.patch(`${API_BASE_URI}/api/obat/${id}`, datas, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteObat = async (id) => {
  const response = await axios.delete(`${API_BASE_URI}/api/obat/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
