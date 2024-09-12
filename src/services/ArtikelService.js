import axios from "axios";
import Cookies from "js-cookie";
import { convertUnixToHuman } from "../utils/DateConverter";

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

export const getAllArtikel = async () => {
  const response = await axios.get(
    `${API_BASE_URI}/api/artikel`,
    getRequestHeaders()
  );
  if (!response.data || !response.data.data) {
    return [];
  }

  const formattedData = response.data.data.map((item) => ({
    ...item,
    tanggalPublikasi: convertUnixToHuman(item.tanggalPublikasi),
  }));

  return formattedData;
};

export const getArtikelById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URI}/api/artikel/${id}`,
      getRequestHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

export const createArtikel = async (datas) => {
  const response = await axios.post(
    `${API_BASE_URI}/api/artikel`,
    datas,
    getRequestHeaders()
  );
  return response;
};

export const updateArtikel = async (id, datas) => {
  const response = await axios.patch(
    `${API_BASE_URI}/api/artikel/${id}`,
    datas,
    getRequestHeaders()
  );
  return response;
};

export const deleteArtikel = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URI}/api/artikel/${id}`,
    getRequestHeaders()
  );
  return response;
};
