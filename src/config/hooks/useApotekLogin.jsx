import { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ApotekAuthContext } from "../context/ApotekAuthContext";

export const useApotekLogin = () => {
  const { dispatch } = useContext(ApotekAuthContext);
  const navigate = useNavigate();

  const apotekLogin = async (username, password) => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_API_BASE_URL
      }/api/admin-apotek/login`;

      const response = await axios.post(apiUrl, { username, password });

      if (response.status === 200) {
        const { token } = response.data;
        const role = "apoteker";

        dispatch({ type: "LOGIN", payload: { token, role } });
        navigate("/apotek/home");
      } else {
        throw new Error("Failed to login. Please check your credentials.");
      }
    } catch (error) {
      console.error("Apoteker login failed:", error);
      throw error;
    }
  };

  return { apotekLogin };
};
