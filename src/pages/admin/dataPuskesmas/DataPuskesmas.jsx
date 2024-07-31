import { useContext, useEffect, useRef, useState } from "react";
import { AddressContext } from "../../../config/context/AdressContext";
import DynamicAddress from "../../../components/dynamicAddress/DynamicAddress";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ZodError } from "zod";
import {
  puskesmasCreateSchema,
  puskesmasUpdateSchema,
} from "../../../validations/PuskesmasSchema";
import {
  createPuskesmas,
  deletepuskesmas,
  getAllPuskesmas,
  getPuskesmasById,
  updatePuskesmas,
} from "../../../services/PuskesmasService";
import {
  handleApiError,
  handleDeleteError,
} from "../../../utils/ApiErrorHandlers";
import Cookies from "js-cookie";
import axios from "axios";
import { ProgressSpinner } from "primereact/progressspinner";

const DataPuskesmas = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState({
    namaPuskesmas: "",
    username: "",
    password: "",
    alamat: "",
    telepon: "",
  });
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [currentName, setCurrentName] = useState("");
  const { address } = useContext(AddressContext);
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const title = "Puskesmas";
  const token = Cookies.get("token");

  const toast = useRef(null);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/admin-puskesmas`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleModalCreate = () => {
    setErrors({});
    setDatas({
      namaPuskesmas: "",
      username: "",
      password: "",
      alamat: "",
      telepon: "",
    });
    setIsEditMode(false);
    setVisible(true);
  };

  const handleCreate = async () => {
    try {
      puskesmasCreateSchema.parse(datas);

      const response = await createPuskesmas(datas);

      if (response.status === 201) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data Puskesmas ditambahkan",
          life: 3000,
        });
        setVisible(false);
        const data = await getAllPuskesmas();
        setData(data);
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
      const dataResponse = await getPuskesmasById(data.id);
      if (dataResponse) {
        setDatas({
          namaPuskesmas: dataResponse.namaPuskesmas,
          username: dataResponse.username,
          alamat: dataResponse.alamat,
          telepon: dataResponse.telepon,
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
      puskesmasUpdateSchema.parse(datas);

      const response = await updatePuskesmas(currentId, datas);

      if (response.status === 200) {
        setVisible(false);
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data Puskesmas diperbarui",
          life: 3000,
        });
        const data = await getAllPuskesmas();
        setData(data);
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
    setCurrentName(data.namaPuskesmas);
    setVisibleDelete(true);
  };

  const handleDelete = async () => {
    setVisibleDelete(false);
    try {
      const response = await deletepuskesmas(currentId);

      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data Puskesmas dihapus",
          life: 3000,
        });
        const data = await getAllPuskesmas();
        setData(data);
      }
    } catch (error) {
      handleDeleteError(error, toast, title);
    }
  };

  const columns = [
    { field: "namaPuskesmas", header: "Nama Puskesmas" },
    { field: "telepon", header: "Telepon" },
    { field: "alamat", header: "Alamat" },
  ];

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <ProgressSpinner />
      </div>
    );

  return (
    <div className="flex flex-col gap-4 p-4 z-10">
      <Toast ref={toast} />
      <div className="bg-white dark:bg-blackHover p-4 rounded-xl">
        <ReusableTable
          columns={columns}
          data={data}
          onCreate={handleModalCreate}
          onEdit={handleModalUpdate}
          onDelete={handleModalDelete}
        />
      </div>
      <Dialog
        header={isEditMode ? "Ubah Data Puskesmas" : "Tambah Data Puskesmas"}
        visible={visible}
        maximizable
        className="md:w-1/2 w-full"
        onHide={() => setVisible(false)}
      >
        <div className="flex flex-col p-4 gap-4">
          <InputText
            type="text"
            placeholder="Nama Puskesmas"
            className="p-input text-lg p-3 rounded"
            value={datas.namaPuskesmas}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                namaPuskesmas: e.target.value,
              }))
            }
          />
          {errors.namaPuskesmas && (
            <small className="p-error -mt-3 text-sm ">
              {errors.namaPuskesmas}
            </small>
          )}
          <InputText
            type="text"
            placeholder="Username"
            className="p-input text-lg p-3 rounded"
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
            className="p-input text-lg p-3 rounded"
            value={datas.password}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
          <span className="text-sm -mt-4 text-orange-700">
            {isEditMode ? "*Kosongkan password jika tidak ingin diubah" : null}
          </span>
          {errors.password && (
            <small className="p-error -mt-3 text-sm">{errors.password}</small>
          )}
          <InputText
            type="text"
            placeholder="Telepon"
            className="p-input text-lg p-3 rounded"
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
          <span className="font-medium">Alamat Puskesmas</span>
          <DynamicAddress />
          <span className="text-sm -mt-4 text-orange-700">
            {isEditMode ? "*Kosongkan alamat jika tidak ingin diubah" : null}
          </span>
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
        header="Hapus Data Puskesmas"
        visible={visibleDelete}
        className="md:w-1/2 w-full"
        onHide={() => setVisibleDelete(false)}
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

export default DataPuskesmas;
