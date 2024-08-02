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

export const getAllPengambilanObat = async () => {
  const response = await axios.get(
    `${API_BASE_URI}/api/pengambilan-obat`,
    getRequestHeaders()
  );
  const formattedData = response.data.data.map((item) => ({
    ...item,
    tanggalPengambilan: convertUnixToHuman(item.tanggalPengambilan),
  }));

  return formattedData;
};

export const getPengambilanObatById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URI}/api/pengambilan-obat/${id}`,
      getRequestHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

export const createPengambilanObat = async (datas) => {
  try {
    const response = await axios.post(
      `${API_BASE_URI}/api/pengambilan-obat`,
      datas,
      getRequestHeaders()
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updatePengambilanObat = async (id, datas) => {
  const response = await axios.patch(
    `${API_BASE_URI}/api/pengambilan-obat/${id}`,
    datas,
    getRequestHeaders()
  );
  return response;
};

export const deletePengambilanObat = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URI}/api/pengambilan-obat/${id}`,
    getRequestHeaders()
  );
  return response;
};

export const PengambilanObatDone = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URI}/api/pengambilan-obat/${id}/diambil`,
    {},
    getRequestHeaders()
  );
  return response;
};

export const PengambilanObatCancelled = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URI}/api/pengambilan-obat/${id}/batal`,
    {},
    getRequestHeaders()
  );
  return response;
};
