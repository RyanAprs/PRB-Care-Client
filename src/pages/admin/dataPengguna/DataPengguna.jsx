import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import DynamicAddress from "../../../components/dynamicAddress/DynamicAddress";
import { AddressContext } from "../../../config/context/AdressContext";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ZodError } from "zod";
import { userSchema } from "../../../validations/PenggunaSchema";
import {
  createPengguna,
  deletePengguna,
  getAllPengguna,
  getPenggunaById,
  updatePengguna,
} from "../../../services/PenggunaService";
import {
  handleApiError,
  handleDeleteError,
} from "../../../utils/ApiErrorHandlers";
import { ProgressSpinner } from "primereact/progressspinner";

const DataPengguna = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState({
    namaLengkap: "",
    username: "",
    password: "",
    telepon: "",
    teleponKeluarga: "",
    alamat: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const token = Cookies.get("token");
  const { address } = useContext(AddressContext);
  const [currentName, setCurrentName] = useState("");
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [errors, setErrors] = useState({});
  const title = "Pengguna";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/pengguna`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

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

  const handleModalCreate = () => {
    setErrors({});
    setDatas({
      namaLengkap: "",
      username: "",
      password: "",
      telepon: "",
      teleponKeluarga: "",
      alamat: "",
    });
    setVisible(true);
    setIsEditMode(false);
  };

  const handleCreate = async () => {
    try {
      userSchema.parse(datas);
      const response = await createPengguna(datas);

      if (response.status === 201) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data Pengguna ditambahkan",
          life: 3000,
        });
        setVisible(false);
        const dataResponse = await getAllPengguna();
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
        handleApiError(error, toast);
      }
    }
  };

  const handleModalUpdate = async (data) => {
    setErrors({});
    try {
      const dataResponse = await getPenggunaById(data.id);
      if (dataResponse) {
        setDatas({
          namaLengkap: dataResponse.namaLengkap,
          username: dataResponse.username,
          password: "",
          alamat: dataResponse.alamat,
          telepon: dataResponse.telepon,
          teleponKeluarga: dataResponse.teleponKeluarga,
        });
        setCurrentId(data.id);
        setVisible(true);
        setIsEditMode(true);
      }
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  const handleUpdate = async () => {
    try {
      userSchema
        .pick({
          namaLengkap: true,
          username: true,
          telepon: true,
          teleponKeluarga: true,
          alamat: true,
        })
        .parse(datas);

      const response = await updatePengguna(currentId, datas);

      if (response.status === 200) {
        setVisible(false);
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data Pengguna diperbarui",
          life: 3000,
        });
        const dataResponse = await getAllPengguna();
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
        handleApiError(error, toast);
      }
    }
  };

  const handleModalDelete = async (data) => {
    setCurrentId(data.id);
    setCurrentName(data.namaLengkap);
    setVisibleDelete(true);
  };

  const handleDelete = async () => {
    setVisibleDelete(false);
    try {
      const response = await deletePengguna(currentId);

      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data Pengguna dihapus",
          life: 3000,
        });
        const response = await getAllPengguna();
        setData(response);
      }
    } catch (error) {
      handleDeleteError(error, toast, title);
    }
  };

  const columns = [
    { field: "namaLengkap", header: "Nama Pengguna" },
    { field: "telepon", header: "Telepon" },
    { field: "teleponKeluarga", header: "Telepon Keluarga" },
    { field: "alamat", header: "Alamat" },
  ];

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <ProgressSpinner />
      </div>
    );
  return (
    <div className="flex flex-col gap-4 p-4 z-10 ">
      <Toast ref={toast} />
      <div className="bg-white dark:bg-blackHover p-4 rounded-xl">
        <ReusableTable
          columns={columns}
          data={data}
          onDelete={handleModalDelete}
          onEdit={handleModalUpdate}
          onCreate={handleModalCreate}
        />
      </div>

      <Dialog
        header={isEditMode ? "Ubah Data Pengguna" : "Tambah Data Pengguna"}
        visible={visible}
        maximizable
        className="md:w-1/2 w-full "
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="flex flex-col p-4 gap-4">
          <InputText
            type="text"
            placeholder="Nama Lengkap Pengguna"
            className="p-input text-lg p-3  rounded"
            value={datas.namaLengkap}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                namaLengkap: e.target.value,
              }))
            }
          />
          {errors.namaLengkap && (
            <small className="p-error -mt-3 text-sm">
              {errors.namaLengkap}
            </small>
          )}
          <InputText
            type="text"
            placeholder="Username"
            className="p-input text-lg p-3  rounded"
            value={datas.username}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                username: e.target.value,
              }))
            }
          />
          {errors.username && (
            <small className="p-error -mt-3 text-sm">{errors.username}</small>
          )}
          <InputText
            type="password"
            placeholder="Password"
            className="p-input text-lg p-3  rounded"
            value={datas.password}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
          {errors.password && (
            <small className="p-error -mt-3 text-sm">{errors.password}</small>
          )}

          <InputText
            type="text"
            placeholder="Telepon"
            className="p-input text-lg p-3  rounded"
            value={datas.telepon}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                telepon: e.target.value,
              }))
            }
          />
          {errors.telepon && (
            <small className="p-error -mt-3 text-sm">{errors.telepon}</small>
          )}
          <InputText
            type="text"
            placeholder="Telepon Keluarga"
            className="p-input text-lg p-3  rounded"
            value={datas.teleponKeluarga}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                teleponKeluarga: e.target.value,
              }))
            }
          />
          {errors.teleponKeluarga && (
            <small className="p-error -mt-3 text-sm">
              {errors.teleponKeluarga}
            </small>
          )}
          <span>Alamat Pengguna</span>
          <DynamicAddress />
          {errors.alamat && (
            <small className="p-error -mt-3 text-sm">{errors.alamat}</small>
          )}
          <Button
            label={isEditMode ? "Edit" : "Simpan"}
            className="p-4 bg-lightGreen text-white rounded-xl hover:mainGreen transition-all"
            onClick={isEditMode ? handleUpdate : handleCreate}
          />
        </div>
      </Dialog>

      <Dialog
        header="Hapus Data Pengguna"
        visible={visibleDelete}
        className="md:w-1/2 w-full "
        onHide={() => {
          if (!visibleDelete) return;
          setVisibleDelete(false);
        }}
      >
        <div className="flex flex-col gap-8">
          <div className="text-xl">
            Apakah anda yakin ingin menghapus data {currentName}?
          </div>
          <div className="flex gap-4 items-end justify-end">
            <Button
              label="Batal"
              onClick={() => setVisibleDelete(false)}
              className="p-button-text"
            />
            <Button label="Hapus" onClick={handleDelete} autoFocus />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DataPengguna;