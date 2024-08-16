import { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import icon from "../../../assets/prbcare.svg";
import DynamicAddress from "../../../components/dynamicAddress/DynamicAddress";
import { AddressContext } from "../../../config/context/AdressContext";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { penggunaRegisterSchema } from "../../../validations/PenggunaSchema";
import { ZodError } from "zod";
import { handleApiError } from "../../../utils/ApiErrorHandlers";
import { Toast } from "primereact/toast";
import { createPengguna } from "../../../services/PenggunaService";

const RegisterPengguna = () => {
  const [datas, setDatas] = useState({
    namaLengkap: "",
    username: "",
    password: "",
    confirmPassword: "",
    telepon: "",
    teleponKeluarga: "",
    alamat: "",
  });
  const [errors, setErrors] = useState("");
  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);
  const [resetAddress, setResetAddress] = useState(true);

  const { address } = useContext(AddressContext);

  useEffect(() => {
    const formattedAddress = [
      address.detail,
      address.desa,
      address.kecamatan,
      address.kabupaten,
      address.provinsi,
    ]
      .filter(Boolean)
      .join(", ");

    setDatas((prev) => ({
      ...prev,
      alamat: formattedAddress,
    }));
  }, [address]);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      penggunaRegisterSchema.parse(datas);

      const response = await createPengguna(datas);
      if (response.status === 201) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "berhasil melakukan register, silahkan login",
          life: 3000,
        });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
        setLoading(false);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        setLoading(false);
        const newErrors = {};
        error.errors.forEach((e) => {
          newErrors[e.path[0]] = e.message;
        });
        setErrors(newErrors);
      } else {
        handleApiError(error, toast);
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-8">
      <Toast ref={toast} />
      <div className="flex w-full flex-col gap-6 md:w-1/2 items-center justify-center">
        <div className="flex flex-col w-full justify-center items-center">
          <img className="h-auto w-48" src={icon} alt="" />
          <h1 className="text-3xl font-semibold">Daftar Pengguna</h1>
        </div>
        <div className="flex flex-col w-full gap-4">
          <label htmlFor="" className="-mb-3">
            Nama Lengkap:
          </label>
          <InputText
            type="text"
            className="p-input text-lg p-4 rounded"
            placeholder="Nama Lengkap"
            value={datas.namaLengkap}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                namaLengkap: e.target.value,
              }))
            }
            required
          />
          {errors.namaLengkap && (
            <span className="text-red-500  -mt-3 text-sm">
              {errors.namaLengkap}
            </span>
          )}
          <label htmlFor="" className="-mb-3">
            Nomor Telepon:
          </label>
          <InputText
            type="text"
            className="p-input text-lg p-4 rounded"
            placeholder="Nomor Telepon"
            value={datas.telepon}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                telepon: e.target.value,
              }))
            }
            required
          />
          {errors.telepon && (
            <span className="text-red-500  -mt-3 text-sm">
              {errors.telepon}
            </span>
          )}
          <label htmlFor="" className="-mb-3">
            Nomor Telepon Keluarga:
          </label>
          <InputText
            type="text"
            className="p-input text-lg p-4 rounded"
            placeholder="Nomor Telepon Keluarga"
            value={datas.teleponKeluarga}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                teleponKeluarga: e.target.value,
              }))
            }
            required
          />
          {errors.teleponKeluarga && (
            <span className="text-red-500  -mt-3 text-sm ">
              {errors.teleponKeluarga}
            </span>
          )}
          <label htmlFor="" className="-mb-3">
            Username:
          </label>
          <InputText
            type="text"
            className="p-input text-lg p-4 rounded"
            placeholder="Username"
            value={datas.username}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                username: e.target.value,
              }))
            }
            required
          />
          {errors.username && (
            <span className="text-red-500  -mt-3 text-sm">
              {errors.username}
            </span>
          )}
          <label htmlFor="" className="-mb-3">
            Password:
          </label>
          <InputText
            type="password"
            className="p-input text-lg p-4 rounded"
            placeholder="Password"
            value={datas.password}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            required
          />
          {errors.password && (
            <span className="text-red-500  -mt-3 text-sm">
              {errors.password}
            </span>
          )}
          <label htmlFor="" className="-mb-3">
            Alamat:
          </label>
          <DynamicAddress reset={resetAddress} />
          {errors.alamat && (
            <p className="text-red-500  -mt-3 text-sm">{errors.alamat}</p>
          )}
        </div>

        <div className="flex flex-col w-full gap-4">
          <Button
            className="bg-mainGreen text-white   hover:bg-mainDarkGreen  p-4 w-full flex justify-center rounded-xl hover:mainGreen transition-all "
            type="submit"
            disabled={isLoading}
            onClick={handleRegister}
          >
            {isLoading ? (
              <ProgressSpinner
                style={{ width: "25px", height: "25px" }}
                strokeWidth="8"
                animationDuration="1s"
                color="white"
              />
            ) : (
              <p>Daftar</p>
            )}
          </Button>
          <p className="text-center">
            <span className="font-normal">
              Dengan mengklik Daftar, anda menyetujui{" "}
            </span>
            <Link
              to="/kebijakan-privasi"
              className="font-semibold text-mainGreen"
            >
              kebijakan privasi
            </Link>
            <span className="font-normal"> kami </span>
          </p>
          <div className="flex w-full gap-2 items-center justify-center">
            Sudah punya akun?
            <Link to="/login" className="text-mainGreen font-semibold">
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPengguna;
