import React, { useContext, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button, Spinner } from "@nextui-org/react";
import icon from "../../../assets/prbcare.svg";
import { ApotekAuthContext } from "../../../config/context/ApotekAuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginApotek = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setLoading] = useState(false);
  const { dispatch } = useContext(ApotekAuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    if (!username && !password) {
      setErrors({ form: "Username dan password tidak boleh kosong" });
      setLoading(false);
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URI}/api/admin-apotek/login`,
          { username, password },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          navigate("/apotek/home");
          dispatch({
            type: "LOGIN",
            payload: { token: response.data.token, role: "apoteker" },
          });
        } else if (response.status === 401) {
          setErrors({ form: "Username atau password salah." });
        } else if (response.status === 400) {
          setErrors({ form: "Username atau password salah." });
        }
      } catch (error) {
        setErrors({ form: "Username atau password salah." });
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div className="min-h-screen w-full flex justify-center items-center p-8">
      <div className="flex w-full flex-col gap-6 md:w-1/2">
        <div className="flex flex-col w-full justify-center items-center">
          <img className="h-auto w-48" src={icon} alt="PRB CARE Logo" />
          <h1 className="text-3xl font-bold">Masuk Apotek</h1>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col w-full gap-4">
          {errors.form && <span className="text-red-500">{errors.form}</span>}
          <Input
            type="text"
            variant="bordered"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            type="password"
            variant="bordered"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            color="default"
            className="text-white bg-buttonCollor "
            type="submit"
            radius="sm"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? <Spinner color="default" size="md" /> : "Masuk"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginApotek;
