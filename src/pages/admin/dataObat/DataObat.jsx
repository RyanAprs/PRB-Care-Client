import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { ZodError } from "zod";
import { Toast } from "primereact/toast";
import {
  handleApiError,
  handleDeleteError,
} from "../../../utils/ApiErrorHandlers";
import {
  createObat,
  deleteObat,
  getAllObat,
  getObatById,
  updateObat,
} from "../../../services/ObatService";
import {
  createObatSchema,
  // obatSchema,
  updateObatSchema,
} from "../../../validations/ObatSchema";
import { ProgressSpinner } from "primereact/progressspinner";

const DataObat = () => {
  const [data, setData] = useState([]);
  const [dataAdminApotek, setDataAdminApotek] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const token = Cookies.get("token");
  const [datas, setDatas] = useState({
    namaObat: "",
    jumlah: 0,
    idAdminApotek: "",
  });
  const [currentId, setCurrentId] = useState("");
  const [currentName, setCurrentName] = useState("");
  const toast = useRef(null);
  const title = "Obat";
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await getAllObat();
        setData(responseData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    const fetchDataAdminApotek = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/admin-apotek`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        setDataAdminApotek(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchDataAdminApotek();
    fetchData();
  }, [token]);

  const handleModalCreate = () => {
    setErrors({});
    setDatas({
      namaObat: "",
      jumlah: 0,
      idAdminApotek: 0,
    });
    setVisible(true);
    setIsEditMode(false);
  };

  const handleCreate = async () => {
    try {
      createObatSchema.parse(datas);
      const response = await createObat(datas);
      if (response.status === 201) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data obat ditambahkan",
          life: 3000,
        });
        setVisible(false);
        const dataResponse = await getAllObat();
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
      const dataResponse = await getObatById(data.id);
      if (dataResponse) {
        setDatas({
          namaObat: dataResponse.namaObat,
          jumlah: dataResponse.jumlah,
          idAdminApotek: dataResponse.idAdminApotek,
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
      updateObatSchema.parse(datas);
      const response = await updateObat(currentId, datas);
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data obat diperbarui",
          life: 3000,
        });
        setVisible(false);
        const dataResponse = await getAllObat();
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
    setCurrentName(data.namaObat);
    setVisibleDelete(true);
  };

  const handleDelete = async () => {
    setVisibleDelete(false);
    try {
      const response = await deleteObat(currentId);

      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data Obat dihapus",
          life: 3000,
        });
        const response = await getAllObat();
        setData(response);
      }
    } catch (error) {
      handleDeleteError(error, toast, title);
    }
  };

  const columns = [
    { header: "Nama Obat", field: "namaObat" },
    { header: "jumlah", field: "jumlah" },
    { header: "Nama Apotek", field: "adminApotek.namaApotek" },
  ];

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <ProgressSpinner />
      </div>
    );

  return (
    <div className="flex flex-col gap-4 p-4 min-h-screen ">
      <Toast ref={toast} />
      <div className="bg-white dark:bg-blackHover p-4 rounded-xl">
        <ReusableTable
          columns={columns}
          data={data}
          onDelete={handleModalDelete}
          onEdit={handleModalUpdate}
          onCreate={handleModalCreate}
          statusOptions=""
        />
      </div>

      <Dialog
        header={isEditMode ? "Ubah Data Obat" : "Tambah Data Obat"}
        visible={visible}
        maximizable
        className="md:w-1/2 w-full "
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <div className="flex flex-col p-4 gap-4">
          <label htmlFor="" className="-mb-3">
            Pilih apotek:
          </label>

          <Dropdown
            value={
              dataAdminApotek.find(
                (apotek) => apotek.id === datas.idAdminApotek
              ) || null
            }
            options={dataAdminApotek}
            filter
            optionLabel="namaApotek"
            placeholder="Pilih Apotek"
            className=" p-2 rounded"
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                idAdminApotek: e.value.id,
              }))
            }
          />
          {errors.idAdminApotek && (
            <small className="p-error -mt-3 text-sm">
              {errors.idAdminApotek}
            </small>
          )}
          <label htmlFor="" className="-mb-3">
            Nama obat:
          </label>

          <InputText
            type="text"
            placeholder="Nama Obat"
            className="p-input text-lg p-3  rounded"
            value={datas.namaObat}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                namaObat: e.target.value,
              }))
            }
          />
          {errors.namaObat && (
            <small className="p-error -mt-3 text-sm">{errors.namaObat}</small>
          )}
          <label htmlFor="" className="-mb-3">
            Jumlah obat:
          </label>

          <InputText
            type="number"
            placeholder="Jumlah"
            className="p-input text-lg p-3  rounded"
            value={datas.jumlah}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                jumlah: parseInt(e.target.value, 10) || 0,
              }))
            }
          />
          {errors.jumlah && (
            <small className="p-error -mt-3 text-sm">{errors.jumlah}</small>
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

export default DataObat;
