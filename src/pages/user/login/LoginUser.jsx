import React, { useContext, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button, Spinner } from "@nextui-org/react";
import icon from "../../../assets/prbcare.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserAuthContext } from "../../../config/context/UserAuthContext";

const LoginUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setLoading] = useState(false);
  const { dispatch } = useContext(UserAuthContext);
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
          `${import.meta.env.VITE_API_BASE_URI}/api/pengguna/login`,
          { username, password },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          navigate("/user/home");
          dispatch({
            type: "LOGIN",
            payload: { token: response.data.token, role: "user" },
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
        <div className="flex flex-col gap-4 w-full justify-center items-center">
          <img className="h-auto w-48" src={icon} alt="PRB CARE Logo" />
          <h1 className="text-3xl font-bold">Masuk Pengguna</h1>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col w-full gap-4">
          {errors.form && (
            <span className="text-red-500">{errors.form}</span>
          )}
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

          <div className="flex flex-col w-full gap-4">
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
            <div className="flex items-center justify-center  text-sm font-semibold text-darkColor">
              ATAU
            </div>
            <Link to="/user/register" className="w-full">
              <Button
                variant="bordered"
                className="text-buttonCollor w-full"
                radius="sm"
                size="lg"
              >
                Daftar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginUser;
