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

export const getAllJadwalProlanis = async () => {
  const response = await axios.get(
    `${API_BASE_URI}/api/jadwal-prolanis   `,
    getRequestHeaders()
  );
  if (!response.data || !response.data.data) {
    return [];
  }

  const formattedData = response.data.data.map((item) => ({
    ...item,
    waktu_mulai: convertUnixToHuman(item.waktu_mulai),
    waktu_selesai: convertUnixToHuman(item.waktu_selesai),
  }));

  return formattedData;
};

export const getJadwalProlanisById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URI}/api/jadwal-prolanis/${id}`,
      getRequestHeaders()
    );
    return response.data.data;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

export const createJadwalProlanis = async (datas) => {
  try {
    const response = await axios.post(
      `${API_BASE_URI}/api/jadwal-prolanis`,
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

export const updateJadwalProlanis = async (id, datas) => {
  const response = await axios.patch(
    `${API_BASE_URI}/api/jadwal-prolanis/${id}`,
    datas,
    getRequestHeaders()
  );
  return response;
};

export const deleteJadwalProlanis = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URI}/api/jadwal-prolanis/${id}`,
    getRequestHeaders()
  );
  return response;
};

export const JadwalProlanisDone = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URI}/api/jadwal-prolanis/${id}/selesai`,
    {},
    getRequestHeaders()
  );
  return response;
};
