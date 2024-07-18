import { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserAuthContext } from "../context/UserAuthContext";

export const useUserLogin = () => {
  const { dispatch } = useContext(UserAuthContext);
  const navigate = useNavigate();

  const userLogin = async (username, password) => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/pengguna/login`;

      const response = await axios.post(apiUrl, { username, password });

      if (response.status === 200) {
        const { token } = response.data;
        const role = "user";

        dispatch({ type: "LOGIN", payload: { token, role } });
        navigate("/user/home");
      } else {
        throw new Error("Failed to login. Please check your credentials.");
      }
    } catch (error) {
      console.error("User login failed:", error);
      throw error;
    }
  };

  return { userLogin };
};
