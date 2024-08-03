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

export const getAllKontrolBalik = async () => {
  const response = await axios.get(
    `${API_BASE_URI}/api/kontrol-balik   `,
    getRequestHeaders()
  );
  if (!response.data || !response.data.data) {
    return [];
  }

  const formattedData = response.data.data.map((item) => ({
    ...item,
    tanggalKontrol: convertUnixToHuman(item.tanggalKontrol),
  }));

  return formattedData;
};

export const getKontrolBalikById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URI}/api/kontrol-balik/${id}`,
      getRequestHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

export const createKontrolBalik = async (datas) => {
  try {
    const response = await axios.post(
      `${API_BASE_URI}/api/kontrol-balik`,
      datas,
      getRequestHeaders()
    );
    console.log("Response: ", response.data);
    return response;
  } catch (error) {
    console.error(
      "Error creating kontrol balik: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateKontrolBalik = async (id, datas) => {
  const response = await axios.patch(
    `${API_BASE_URI}/api/kontrol-balik/${id}`,
    datas,
    getRequestHeaders()
  );
  return response;
};

export const deleteKontrolBalik = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URI}/api/kontrol-balik/${id}`,
    getRequestHeaders()
  );
  return response;
};

export const kontrolBalikDone = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URI}/api/kontrol-balik/${id}/selesai`,
    {},
    getRequestHeaders()
  );
  return response;
};

export const kontrolBalikCancelled = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URI}/api/kontrol-balik/${id}/batal`,
    {},
    getRequestHeaders()
  );
  return response;
};
