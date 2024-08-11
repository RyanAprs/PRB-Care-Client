import { useContext, useEffect, useRef, useState } from "react";
import {
  getCurrentAdminPuskesmas,
  updateCurrentPuskesmas,
  updatePasswordPuskesmas,
} from "../../../services/PuskesmasService";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { AddressContext } from "../../../config/context/AdressContext";
import DynamicAddress from "../../../components/dynamicAddress/DynamicAddress";
import { Toast } from "primereact/toast";
import {
  handleApiError,
  handleChangePasswordError,
} from "../../../utils/ApiErrorHandlers";
import { ZodError } from "zod";
import {
  puskesmasChangePasswordSchema,
  puskesmasUpdateCurrentSchema,
} from "../../../validations/PuskesmasSchema";
import { HandleUnauthorizedAdminPuskesmas } from "../../../utils/HandleUnauthorized";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../config/context/AuthContext";

const ProfilePuskesmas = () => {
  const { dispatch } = useContext(AuthContext);
  const [data, setData] = useState({
    namaPuskesmas: "",
    telepon: "",
    alamat: "",
  });
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const [visibleChangePassword, setVisibleChangePassword] = useState(false);
  const { address } = useContext(AddressContext);
  const [dataPassword, setDataPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCurrentAdminPuskesmas();
        setData(response);
      } catch (error) {
        HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [navigate, dispatch]);

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

    setData((prev) => ({
      ...prev,
      alamat: formattedAddress,
    }));
  }, [address]);

  const handleUpdateModal = () => {
    setVisibleUpdate(true);
  };

  const handleUpdate = async () => {
    try {
      puskesmasUpdateCurrentSchema.parse(data);

      const response = await updateCurrentPuskesmas(data);

      if (response.status === 200) {
        setVisibleUpdate(false);
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data Pengguna diperbarui",
          life: 3000,
        });
        const dataResponse = await getCurrentAdminPuskesmas();
        setData(dataResponse);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors = {};
        error.errors.forEach((e) => {
          newErrors[e.path[0]] = e.message;
        });
        setErrors(newErrors);
      } else {
        HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        handleApiError(error, toast);
      }
    }
  };

  const handleModalChangePassword = () => {
    setDataPassword({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setVisibleChangePassword(true);
  };

  const handleChangePassword = async () => {
    try {
      puskesmasChangePasswordSchema.parse(dataPassword);
      const response = await updatePasswordPuskesmas(dataPassword);
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Password diperbarui",
          life: 3000,
        });
        setVisibleChangePassword(false);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors = {};
        error.errors.forEach((e) => {
          newErrors[e.path[0]] = e.message;
        });
        setErrors(newErrors);
      } else {
        HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        handleChangePasswordError(error, toast);
      }
    }
  };

  return (
    <div className="h-full  w-full flex justify-center items-center py-32  px-60 rounded shadow-xl">
      <Toast ref={toast} />

      <div className="flex flex-col items-center p-4 justify-center gap-8 bg-white dark:bg-blackHover shadow-xl px-32">
        <div className="flex flex-col gap-4 p-8 text-xl font-semibold">
          <div className="flex justify-start gap-6 items-center">
            <h1>Nama Puskesmas:</h1>
            <h1>{data.namaPuskesmas}</h1>
          </div>
          <div className="flex justify-start gap-6 items-center">
            <h1>Telepon:</h1>
            <p>{data.telepon}</p>
          </div>
          <div className="flex justify-start gap-6 items-center">
            <h1>Alamat: </h1>
            <p>{data.alamat}</p>
          </div>
        </div>
        <div className="flex gap-8">
          <Button
            onClick={handleUpdateModal}
            text
            raised
            className=" bg-lightGreen dark:bg-black dark:text-white md:text-lg text-sm text-black rounded-xl"
            label="Edit Profile"
          />
          <Button
            onClick={handleModalChangePassword}
            text
            raised
            className=" bg-lightGreen dark:bg-black dark:text-white md:text-lg text-sm text-black rounded-xl"
            label="Edit Password"
          />
        </div>
      </div>

      <Dialog
        header={"Ubah Profile"}
        visible={visibleUpdate}
        maximizable
        className="md:w-1/2 w-full "
        onHide={() => {
          if (!visibleUpdate) return;
          setVisibleUpdate(false);
        }}
      >
        <div className="flex flex-col p-4 gap-4">
          <label htmlFor="" className="-mb-3">
            Nama Puskesmas:
          </label>

          <InputText
            type="text"
            placeholder="Nama Puskesmas"
            className="p-input text-lg p-3  rounded"
            value={data.namaPuskesmas}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                namaPuskesmas: e.target.value,
              }))
            }
          />
          {errors.namaPuskesmas && (
            <small className="p-error -mt-3 text-sm">
              {errors.namaPuskesmas}
            </small>
          )}

          <label htmlFor="" className="-mb-3">
            Telepon:
          </label>

          <InputText
            type="text"
            placeholder="Telepon"
            className="p-input text-lg p-3  rounded"
            value={data.telepon}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                telepon: e.target.value,
              }))
            }
          />
          {errors.telepon && (
            <small className="p-error -mt-3 text-sm">{errors.telepon}</small>
          )}

          <label htmlFor="" className="-mb-3">
            Alamat
          </label>
          <DynamicAddress />
          <span className="text-sm -mt-4 text-orange-700">
            {"*Kosongkan alamat jika tidak ingin diubah"}
          </span>
          {errors.alamat && (
            <small className="p-error -mt-3 text-sm">{errors.alamat}</small>
          )}

          <Button
            label={"Edit"}
            className="p-4 bg-lightGreen text-white rounded-xl hover:mainGreen transition-all"
            onClick={handleUpdate}
          />
        </div>
      </Dialog>

      <Dialog
        header={"Ubah Password"}
        visible={visibleChangePassword}
        maximizable
        className="md:w-1/2 w-full "
        onHide={() => {
          if (!visibleChangePassword) return;
          setVisibleChangePassword(false);
        }}
      >
        <div className="flex flex-col p-4 gap-4">
          <label htmlFor="" className="-mb-3">
            Password lama:
          </label>

          <InputText
            type="password"
            placeholder="Password Lama"
            className="p-input text-lg p-3  rounded"
            value={dataPassword.currentPassword}
            onChange={(e) =>
              setDataPassword((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
          />
          {errors.currentPassword && (
            <small className="p-error -mt-3 text-sm">
              {errors.currentPassword}
            </small>
          )}
          <label htmlFor="" className="-mb-3">
            Password baru:
          </label>
          <InputText
            type="password"
            placeholder="Password Baru"
            className="p-input text-lg p-3  rounded"
            value={dataPassword.newPassword}
            onChange={(e) =>
              setDataPassword((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
          />
          {errors.newPassword && (
            <small className="p-error -mt-3 text-sm">
              {errors.newPassword}
            </small>
          )}
          <label htmlFor="" className="-mb-3">
            Konfirmasi password:
          </label>
          <InputText
            type="password"
            placeholder="Konfirmasi Password Baru"
            className="p-input text-lg p-3  rounded"
            value={data.confirmPassword}
            onChange={(e) =>
              setDataPassword((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
          />
          {errors.confirmPassword && (
            <small className="p-error -mt-3 text-sm">
              {errors.confirmPassword}
            </small>
          )}
          <Button
            label={"Edit"}
            className="p-4 bg-lightGreen text-white rounded-xl hover:mainGreen transition-all"
            onClick={handleChangePassword}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default ProfilePuskesmas;
