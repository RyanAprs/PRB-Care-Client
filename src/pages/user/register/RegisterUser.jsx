import React, { useState, useContext } from "react";
import { Input, Button, Spinner } from "@nextui-org/react";
import { Link, useNavigate } from "react-router-dom";
import icon from "../../../assets/prbcare.svg";
import { z } from "zod";
import DynamicAddress, {
  validateAddress,
} from "../../../components/dynamicAddress/DynamicAddress";
import { AddressContext } from "../../../config/context/AdressContext";
import axios from "axios";

const RegisterUser = () => {
  const [namaLengkap, setnamaLengkap] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telepon, setTelepon] = useState("");
  const [teleponKeluarga, setTeleponKeluarga] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const { address } = useContext(AddressContext);
  const alamat = `${address.detail}, ${address.desa}, ${address.kecamatan}, ${address.kabupaten}, ${address.provinsi}`;

  const navigate = useNavigate();

  const registerSchema = z
    .object({
      namaLengkap: z.string().min(1, "Nama lengkap tidak boleh kosong"),
      username: z
        .string()
        .min(6, "Password minimal 6 karakter")
        .refine(
          (val) => !/\s/.test(val),
          "Username tidak boleh mengandung spasi"
        ),
      password: z
        .string()
        .min(6, "Password minimal 6 karakter")
        .max(255, "Password maksimal 255 karakter")
        .refine(
          (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
          "Password harus mengandung karakter khusus, contoh=!@#$%^&*()"
        )
        .refine((val) => /[0-9]/.test(val), "Password harus mengandung angka")
        .refine(
          (val) => /[A-Z]/.test(val),
          "Password harus mengandung huruf besar"
        )
        .refine(
          (val) => /[a-z]/.test(val),
          "Password harus mengandung huruf kecil"
        )
        .refine(
          (val) => !/\s/.test(val),
          "Password tidak boleh mengandung spasi"
        ),
      confirmPassword: z
        .string()
        .min(1, "Konfirmasi password tidak boleh kosong"),
      telepon: z
        .string()
        .min(10, "Nomor telepon minimal 10 karakter")
        .regex(/^[0-9]+$/, "Nomor telepon harus berupa angka"),
      teleponKeluarga: z
        .string()
        .min(10, "Nomor telepon keluarga minimal 10 karakter")
        .regex(/^[0-9]+$/, "Nomor telepon keluarga harus berupa angka"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password konfirmasi tidak cocok",
      path: ["confirmPassword"],
    });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);

    const result = registerSchema.safeParse({
      namaLengkap,
      username,
      password,
      confirmPassword,
      telepon,
      teleponKeluarga,
    });

    if (!result.success) {
      setLoading(false);
      const newErrors = {};
      result.error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setError(newErrors);
      return;
    }

    if (!validateAddress(address)) {
      setLoading(false);
      setError((prevErrors) => ({
        ...prevErrors,
        alamat: "Alamat tidak valid. Mohon periksa kembali.",
      }));
      return;
    }

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/pengguna`;

      const response = await axios.post(apiUrl, {
        namaLengkap,
        telepon,
        teleponKeluarga,
        alamat,
        username,
        password,
      });

      if (response.status === 201) {
        navigate("/user/login");
      } else {
        throw new Error("Failed to login. Please check your credentials.");
      }
    } catch (error) {
      console.error("User login failed:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-8">
      <div className="flex w-full flex-col gap-6 md:w-1/2 items-center justify-center">
        <div className="flex flex-col gap-4 w-full justify-center items-center">
          <img className="h-auto w-48" src={icon} alt="" />
          <h1 className="text-3xl font-bold">Daftar Pengguna</h1>
        </div>
        <div className="flex flex-col w-full gap-4">
          Data Pengguna
          <Input
            type="text"
            variant="bordered"
            label="Nama Lengkap"
            value={namaLengkap}
            onChange={(e) => setnamaLengkap(e.target.value)}
            required
          />
          {error.namaLengkap && (
            <span className="text-red-500">{error.namaLengkap}</span>
          )}
          <Input
            type="text"
            variant="bordered"
            label="Nomor Telepon"
            value={telepon}
            onChange={(e) => setTelepon(e.target.value)}
            required
          />
          {error.telepon && (
            <span className="text-red-500">{error.telepon}</span>
          )}
          <Input
            type="text"
            variant="bordered"
            label="Nomor Telepon Keluarga"
            value={teleponKeluarga}
            onChange={(e) => setTeleponKeluarga(e.target.value)}
            required
          />
          {error.teleponKeluarga && (
            <span className="text-red-500">{error.teleponKeluarga}</span>
          )}
          <Input
            type="text"
            variant="bordered"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {error.username && (
            <span className="text-red-500">{error.username}</span>
          )}
          <Input
            type="password"
            variant="bordered"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error.password && (
            <span className="text-red-500">{error.password}</span>
          )}
          <Input
            type="password"
            variant="bordered"
            label="Konfirmasi Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error.confirmPassword && (
            <span className="text-red-500">{error.confirmPassword}</span>
          )}
          <DynamicAddress />
          {error.alamat && <p className="text-red-500">{error.alamat}</p>}
        </div>
        <div className="flex flex-col w-full gap-4">
          <Button
            onClick={handleRegister}
            color="default"
            className="text-white bg-buttonCollor "
            type="submit"
            radius="sm"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? <Spinner color="default" size="md" /> : "Daftar"}
          </Button>
          <div className="flex items-center justify-center text-sm text-darkColor font-semibold">
            ATAU
          </div>
          <Link to="/user/login" className="w-full">
            <Button
              variant="bordered"
              className="text-buttonCollor w-full"
              radius="sm"
              size="lg"
            >
              Masuk
            </Button>
          </Link>
        </div>
        <p className="text-center px-4">
          <span className="font-normal opacity-60">
            Dengan mengklik Daftar, Anda menyetujui{" "}
          </span>
          <span className="font-bold opacity-100">Ketentuan layanan</span>
          <span className="font-normal opacity-60"> dan </span>
          <span className="font-bold opacity-100">kebijakan privasi kami</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterUser;
