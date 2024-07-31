import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URI = import.meta.env.VITE_API_BASE_URI;
const token = Cookies.get("token");

export const updatePassword = async (datas) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URI}/api/admin-super/current/password`,
      datas,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
