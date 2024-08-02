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

export const getAllPasien = async () => {
  const response = await axios.get(
    `${API_BASE_URI}/api/pasien`,
    getRequestHeaders()
  );
  const formatedData = response.data.data.map((item) => ({
    ...item,
    tanggalPeriksa: convertUnixToHuman(item.tanggalPeriksa),
  }));
  return formatedData;
};

export const getAllPasienAktif = async () => {
  const response = await axios.get(
    `${API_BASE_URI}/api/pasien?status=aktif`,
    getRequestHeaders()
  );
  const formatedData = response.data.data.map((item) => ({
    ...item,
    tanggalPeriksa: convertUnixToHuman(item.tanggalPeriksa),
  }));
  return formatedData;
};

export const getPasienById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URI}/api/pasien/${id}`,
      getRequestHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

export const createPasien = async (datas) => {
  const response = await axios.post(
    `${API_BASE_URI}/api/pasien`,
    datas,
    getRequestHeaders()
  );
  return response;
};

export const updatePasien = async (id, datas) => {
  const response = await axios.patch(
    `${API_BASE_URI}/api/pasien/${id}`,
    datas,
    getRequestHeaders()
  );
  return response;
};

export const deletePasien = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URI}/api/pasien/${id}`,
    getRequestHeaders()
  );
  return response;
};

export const pasienDone = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URI}/api/pasien/${id}/selesai`,
    "",
    getRequestHeaders()
  );
  return response;
};
