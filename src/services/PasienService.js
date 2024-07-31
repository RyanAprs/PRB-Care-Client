import axios from "axios";
import Cookies from "js-cookie";
import { convertUnixToHuman } from "../utils/DateConverter";

const API_BASE_URI = import.meta.env.VITE_API_BASE_URI;

const token = Cookies.get("token");

export const getAllPasien = async () => {
  const response = await axios.get(`${API_BASE_URI}/api/pasien`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const formatedData = response.data.data.map((item) => ({
    ...item,
    tanggalPeriksa: convertUnixToHuman(item.tanggalPeriksa),
  }));
  return formatedData;
};

export const getPasienById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URI}/api/pasien/${id}`, {
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

export const createPasien = async (datas) => {
  const response = await axios.post(`${API_BASE_URI}/api/pasien`, datas, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const updatePasien = async (id, datas) => {
  const response = await axios.patch(
    `${API_BASE_URI}/api/pasien/${id}`,
    datas,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const deletePasien = async (id) => {
  const response = await axios.delete(`${API_BASE_URI}/api/pasien/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const pasienDone = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URI}/api/pasien/${id}/selesai`,
    "",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
