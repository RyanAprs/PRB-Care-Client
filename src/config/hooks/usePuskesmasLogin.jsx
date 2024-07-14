import { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PuskesmasAuthContext } from "../context/PuskesmasAuthContext";

export const usePuskesmasLogin = () => {
  const { dispatch } = useContext(PuskesmasAuthContext);
  const navigate = useNavigate();

  const puskesmasLogin = async (username, password) => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_API_BASE_URL
      }/api/admin-puskesmas/login`;

      const response = await axios.post(apiUrl, { username, password });

      if (response.status === 200) {
        const { token } = response.data;
        const role = "nakes";

        dispatch({ type: "LOGIN", payload: { token, role } });
        navigate("/puskesmas/home");
      } else {
        throw new Error("Failed to login. Please check your credentials.");
      }
    } catch (error) {
      console.error("Nakes login failed:", error);
      throw error;
    }
  };

  return { puskesmasLogin };
};
