import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URI = import.meta.env.VITE_API_BASE_URI;

const token = Cookies.get("token");

export const getAllApotek = async () => {
  const response = await axios.get(`${API_BASE_URI}/api/admin-apotek`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

export const getApotekById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URI}/api/admin-apotek/${id}`, {
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

export const createApotek = async (datas) => {
  const response = await axios.post(`${API_BASE_URI}/api/admin-apotek`, datas, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const updateApotek = async (id, datas) => {
  const response = await axios.patch(
    `${API_BASE_URI}/api/admin-apotek/${id}`,
    datas,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const deleteApotek = async (id) => {
  const response = await axios.delete(
    `${API_BASE_URI}/api/admin-apotek/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
