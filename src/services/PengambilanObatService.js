import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URI = import.meta.env.VITE_API_BASE_URI;

const token = Cookies.get("token");

export const getAllPengambilanObat = async () => {
  const response = await axios.get(`${API_BASE_URI}/api/pengambilan-obat`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

export const getPengambilanObatById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URI}/api/pengambilan-obat/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const deletePengambilanObat = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URI}/api/pengambilan-obat/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const PengambilanObatDone = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URI}/api/pengambilan-obat/${id}/diambil`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const PengambilanObatCancelled = async (id) => {
  const response = await axios.patch(
    `${API_BASE_URI}/api/pengambilan-obat/${id}/batal`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
