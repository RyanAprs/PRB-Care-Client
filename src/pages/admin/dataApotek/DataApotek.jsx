import { useContext, useEffect, useRef, useState } from "react";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import DynamicAddress from "../../../components/dynamicAddress/DynamicAddress";
import { AddressContext } from "../../../config/context/AdressContext";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { ZodError } from "zod";

import {
  handleApiError,
  handleDeleteError,
} from "../../../utils/ApiErrorHandlers";
import {
  apotekCreateSchema,
  apotekUpdateSchema,
} from "../../../validations/ApotekSchema";
import axios from "axios";
import Cookies from "js-cookie";
import { ProgressSpinner } from "primereact/progressspinner";
import {
  createApotek,
  deleteApotek,
  getAllApotek,
  getApotekById,
  updateApotek,
} from "../../../services/ApotekService";

const DataApotek = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState({
    namaApotek: "",
    username: "",
    password: "",
    telepon: "",
    alamat: "",
  });
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const { address } = useContext(AddressContext);
  const [currentName, setCurrentName] = useState("");
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const title = "Apotek";
  const [resetAddress, setResetAddress] = useState(false);
  const token = Cookies.get("token");

  const customSort = (a, b) => {
    if (a.namaApotek < b.namaApotek) return -1;
    if (a.namaApotek > b.namaApotek) return 1;
    return 0;
  };

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
          `${import.meta.env.VITE_API_BASE_URI}/api/admin-apotek`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const sortedData = response.data.data.sort(customSort);
        setData(sortedData);
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
      namaApotek: "",
      username: "",
      password: "",
      alamat: "",
      telepon: "",
    });
    setIsEditMode(false);
    setVisible(true);
    setResetAddress(true);
  };

  const handleCreate = async () => {
    try {
      apotekCreateSchema.parse(datas);
      const response = await createApotek(datas);

      if (response.status === 201) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data apotek ditambahkan.",
          life: 3000,
        });
        setVisible(false);
        const dataResponse = await getAllApotek();
        const sortedData = dataResponse.sort(customSort);
        setData(sortedData);
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
      const dataResponse = await getApotekById(data.id);
      if (dataResponse) {
        setDatas({
          namaApotek: dataResponse.namaApotek,
          username: dataResponse.username,
          alamat: dataResponse.alamat,
          telepon: dataResponse.telepon,
        });
        setCurrentId(data.id);
        setIsEditMode(true);
        setVisible(true);
        setResetAddress(true);
      }
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  const handleUpdate = async () => {
    try {
      apotekUpdateSchema.parse(datas);
      const response = await updateApotek(currentId, datas);

      if (response.status === 200) {
        setVisible(false);
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data apotek diperbarui.",
          life: 3000,
        });
        const dataResponse = await getAllApotek();
        const sortedData = dataResponse.sort(customSort);
        setData(sortedData);
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

  const handleModalDelete = (data) => {
    setCurrentId(data.id);
    setCurrentName(data.namaApotek);
    setVisibleDelete(true);
  };

  const handleDelete = async () => {
    setVisibleDelete(false);
    try {
      const response = await deleteApotek(currentId);

      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data apotek dihapus.",
          life: 3000,
        });
        const dataResponse = await getAllApotek();
        const sortedData = dataResponse.sort(customSort);
        setData(sortedData);
      }
    } catch (error) {
      handleDeleteError(error, toast, title);
    }
  };

  const columns = [
    { field: "namaApotek", header: "Nama Apotek" },
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
          onDelete={handleModalDelete}
          onEdit={handleModalUpdate}
          onCreate={handleModalCreate}
        />
      </div>

      <Dialog
        header={isEditMode ? "Ubah Data Apotek" : "Tambah Data Apotek"}
        visible={visible}
        maximizable
        className="md:w-1/2 w-full"
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="flex flex-col p-4 gap-4">
          <label htmlFor="" className="-mb-3">
            Nama apotek:
          </label>
          <InputText
            type="text"
            placeholder="Nama Apotek"
            className="p-input text-lg p-3 rounded"
            value={datas.namaApotek}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                namaApotek: e.target.value,
              }))
            }
          />
          {errors.namaApotek && (
            <small className="p-error -mt-3 text-sm">{errors.namaApotek}</small>
          )}
          <label htmlFor="" className="-mb-3">
            Username:
          </label>
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
          <label htmlFor="" className="-mb-3">
            Password:
          </label>
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
          <label htmlFor="" className="-mb-3">
            Telepon:
          </label>
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

          <label htmlFor="" className="-mb-3">
            Alamat:
          </label>
          <DynamicAddress reset={resetAddress} />
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
        header="Hapus Data Apotek"
        visible={visibleDelete}
        className="md:w-1/2 w-full"
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

export default DataApotek;
