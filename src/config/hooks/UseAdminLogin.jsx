import { useContext } from "react";
import axios from "axios";
import { AdminAuthContext } from "../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";

export const UseAdminLogin = () => {
  const { dispatch } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  const adminLogin = async (username, password) => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_API_BASE_URL
      }/api/admin-super/login`;

      const response = await axios.post(apiUrl, { username, password });

      if (response.status === 200) {
        const { token } = response.data;
        const role = "admin";

        dispatch({ type: "LOGIN", payload: { token, role } });
        navigate("/admin/home");
      } else {
        throw new Error("Failed to login. Please check your credentials.");
      }
    } catch (error) {
      console.error("Admin login failed:", error);
      throw error;
    }
  };

  return { adminLogin };
};