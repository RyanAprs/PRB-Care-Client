import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Button, Spinner } from "@nextui-org/react";
// import logo from "../../../assets/PRB-CARE-LOGO.png";
import icon from "../../../assets/PRB-CARE-ICON.png";
import { z } from "zod";
import { useUserLogin } from "../../../config/hooks/useUserLogin";
import { Link } from "react-router-dom";

const LoginUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setLoading] = useState(false);
  const { userLogin } = useUserLogin();

  const loginSchema = z.object({
    username: z.string().min(1, "Username tidak boleh kosong"),
    password: z.string().min(1, "Password tidak boleh kosong"),
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const result = loginSchema.safeParse({ username, password });

    if (!result.success) {
      setLoading(false);
      const newErrors = {};
      result.error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    try {
      await userLogin(username, password);
    } catch (error) {
      setErrors("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
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
          <Input
            type="text"
            variant="bordered"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && (
            <span className="text-red-500">{errors.username}</span>
          )}
          <Input
            type="password"
            variant="bordered"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password}</span>
          )}

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
