import { useContext, useEffect, useRef, useState } from "react";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import DynamicAddress from "../../../components/dynamicAddress/DynamicAddress";
import { AddressContext } from "../../../config/context/AdressContext";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ZodError } from "zod";
import ModalLoading from "/src/components/modalLoading/ModalLoading.jsx";
import {
  penggunaCreateSchema,
  penggunaUpdateSchema,
} from "../../../validations/PenggunaSchema";
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
import { HandleUnauthorizedAdminSuper } from "../../../utils/HandleUnauthorized";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../config/context/AuthContext";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ErrorConnection from "../../../components/errorConnection/ErrorConnection";

const DataPengguna = () => {
  const { dispatch } = useContext(AuthContext);
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
  const [beforeModalLoading, setBeforeModalLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const { token } = useContext(AuthContext);
  const { address } = useContext(AddressContext);
  const [currentName, setCurrentName] = useState("");
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [errors, setErrors] = useState({});
  const [resetAddress, setResetAddress] = useState(false);
  const [prevAddress, setPrevAddress] = useState({});
  const title = "Pengguna";
  const navigate = useNavigate();
  const [isConnectionError, setisConnectionError] = useState(false);
  const [isButtonLoading, setButtonLoading] = useState(null);
  const customSort = (a, b) => {
    if (a.namaLengkap < b.namaLengkap) return -1;
    if (a.namaLengkap > b.namaLengkap) return 1;
    return 0;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllPengguna();
      const sortedData = response.sort(customSort);
      setData(sortedData);
      setLoading(false);
      setisConnectionError(false);
    } catch (error) {
      if (
        error.code === "ERR_NETWORK" ||
        error.code === "ETIMEDOUT" ||
        error.code === "ECONNABORTED" ||
        error.code === "ENOTFOUND" ||
        error.code === "ECONNREFUSED" ||
        error.code === "EAI_AGAIN" ||
        error.code === "EHOSTUNREACH" ||
        error.code === "ECONNRESET" ||
        error.code === "EPIPE"
      ) {
        setisConnectionError(true);
      }
      HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [token, navigate, dispatch]);

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
    setBeforeModalLoading(true);
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
    setResetAddress(true);
    setBeforeModalLoading(false);
  };

  const handleCreate = async () => {
    try {
      setButtonLoading(true);
      penggunaCreateSchema.parse(datas);
      const response = await createPengguna(datas);

      if (response.status === 201) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data Pengguna ditambahkan",
          life: 3000,
        });
        setVisible(false);
        setButtonLoading(false);
        try {
          setLoading(true);
          const response = await getAllPengguna();
          const sortedData = response.sort(customSort);
          setData(sortedData);
          setLoading(false);
          setisConnectionError(false);
        } catch (error) {
          if (
            error.code === "ERR_NETWORK" ||
            error.code === "ETIMEDOUT" ||
            error.code === "ECONNABORTED" ||
            error.code === "ENOTFOUND" ||
            error.code === "ECONNREFUSED" ||
            error.code === "EAI_AGAIN" ||
            error.code === "EHOSTUNREACH" ||
            error.code === "ECONNRESET" ||
            error.code === "EPIPE"
          ) {
            setisConnectionError(true);
          }
          HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
          setLoading(false);
        }
      }
    } catch (error) {
      setButtonLoading(false);
      if (error instanceof ZodError) {
        const newErrors = {};
        error.errors.forEach((e) => {
          newErrors[e.path[0]] = e.message;
        });
        setErrors(newErrors);
      } else if (error.response && error.response.status === 409) {
        handleApiError(error, toast);
      } else {
        setVisible(false);
        HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
        handleApiError(error, toast);
      }
    }
  };

  const handleModalUpdate = async (data) => {
    setBeforeModalLoading(true);
    setErrors({});
    try {
      const dataResponse = await getPenggunaById(data.id);
      setPrevAddress(dataResponse.alamat);
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
      HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
      handleApiError(error, toast);
    }
    setBeforeModalLoading(false);
  };

  const handleUpdate = async () => {
    try {
      setButtonLoading(true);
      const updatedDatas = {
        ...datas,
        alamat: datas.alamat || prevAddress,
      };
      penggunaUpdateSchema.parse(updatedDatas);

      const response = await updatePengguna(currentId, updatedDatas);

      if (response.status === 200) {
        setVisible(false);
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data Pengguna diperbarui",
          life: 3000,
        });
        setButtonLoading(false);
        try {
          setLoading(true);
          const response = await getAllPengguna();
          const sortedData = response.sort(customSort);
          setData(sortedData);
          setLoading(false);
          setisConnectionError(false);
        } catch (error) {
          if (
            error.code === "ERR_NETWORK" ||
            error.code === "ETIMEDOUT" ||
            error.code === "ECONNABORTED" ||
            error.code === "ENOTFOUND" ||
            error.code === "ECONNREFUSED" ||
            error.code === "EAI_AGAIN" ||
            error.code === "EHOSTUNREACH" ||
            error.code === "ECONNRESET" ||
            error.code === "EPIPE"
          ) {
            setisConnectionError(true);
          }
          HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
          setLoading(false);
        }
      }
    } catch (error) {
      setButtonLoading(false);
      if (error instanceof ZodError) {
        const newErrors = {};
        error.errors.forEach((e) => {
          newErrors[e.path[0]] = e.message;
        });
        setErrors(newErrors);
      } else if (error.response && error.response.status === 409) {
        handleApiError(error, toast);
      } else {
        setVisible(false);
        HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
        handleApiError(error, toast);
      }
    }
  };

  const handleModalDelete = async (data) => {
    setBeforeModalLoading(true);
    setCurrentId(data.id);
    setCurrentName(data.namaLengkap);
    setVisibleDelete(true);
    setBeforeModalLoading(false);
  };

  const handleDelete = async () => {
    try {
      setButtonLoading(true);
      const response = await deletePengguna(currentId);
      if (response.status === 200) {
        setVisibleDelete(false);
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data Pengguna dihapus",
          life: 3000,
        });
        setButtonLoading(false);
        try {
          setLoading(true);
          const response = await getAllPengguna();
          const sortedData = response.sort(customSort);
          setData(sortedData);
          setLoading(false);
          setisConnectionError(false);
        } catch (error) {
          if (
            error.code === "ERR_NETWORK" ||
            error.code === "ETIMEDOUT" ||
            error.code === "ECONNABORTED" ||
            error.code === "ENOTFOUND" ||
            error.code === "ECONNREFUSED" ||
            error.code === "EAI_AGAIN" ||
            error.code === "EHOSTUNREACH" ||
            error.code === "ECONNRESET" ||
            error.code === "EPIPE"
          ) {
            setisConnectionError(true);
          }
          HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
          setLoading(false);
        }
      }
    } catch (error) {
      setVisibleDelete(false);
      HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
      handleDeleteError(error, toast, title);
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();

    doc.text("Data Pengguna", 20, 10);

    const tableColumn = columns.map((col) => col.header);

    const tableRows = data.map((item) => {
      return columns.map((col) => {
        const fields = col.field.split(".");
        let value = item;
        fields.forEach((field) => {
          value = value ? value[field] : "";
        });
        return value || "-";
      });
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("data-pengguna.pdf");
  };

  const columns = [
    { field: "namaLengkap", header: "Nama Pengguna" },
    { field: "telepon", header: "Telepon" },
    { field: "teleponKeluarga", header: "Telepon Keluarga" },
    { field: "alamat", header: "Alamat" },
  ];

  if (loading)
    return (
      <div className="min-h-screen flex flex-col gap-4 p-4 z-10 ">
        <div className="bg-white min-h-screen dark:bg-blackHover p-4 rounded-xl flex items-center justify-center">
          <ProgressSpinner />
        </div>
      </div>
    );

  if (isConnectionError) {
    return <ErrorConnection fetchData={fetchData} />;
  }
  return (
    <div className="min-h-screen flex flex-col gap-4 p-4 z-10 ">
      <ModalLoading className={beforeModalLoading ? `` : `hidden`} />
      <Toast
        ref={toast}
        position={window.innerWidth <= 767 ? "top-center" : "top-right"}
      />
      <div className="bg-white min-h-screen dark:bg-blackHover rounded-xl">
        <ReusableTable
          columns={columns}
          data={data}
          onDelete={handleModalDelete}
          onEdit={handleModalUpdate}
          onCreate={handleModalCreate}
          onDownload={handleDownload}
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
          <label htmlFor="" className="-mb-3">
            Nama pengguna:
          </label>
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
          <label htmlFor="" className="-mb-3">
            Username:
          </label>
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
          <label htmlFor="" className="-mb-3">
            Password:
          </label>
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
          <span className="text-sm -mt-4">
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
          <label htmlFor="" className="-mb-3">
            Telepon keluarga:
          </label>
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
          <label htmlFor="" className="-mb-3">
            Alamat
          </label>
          <DynamicAddress
            {...(isEditMode
              ? { prevAddress: prevAddress }
              : { reset: resetAddress })}
          />{" "}
          <span className="text-sm -mt-4">
            {isEditMode ? "*Kosongkan alamat jika tidak ingin diubah" : null}
          </span>
          {errors.alamat && (
            <small className="p-error -mt-3 text-sm">{errors.alamat}</small>
          )}
          <Button
            disabled={isButtonLoading}
            className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen p-4 w-full flex justify-center rounded-xl hover:mainGreen transition-all"
            onClick={isEditMode ? handleUpdate : handleCreate}
          >
            {isButtonLoading ? (
              <ProgressSpinner
                style={{ width: "25px", height: "25px" }}
                strokeWidth="8"
                animationDuration="1s"
                color="white"
              />
            ) : (
              <p>{isEditMode ? "Edit" : "Simpan"}</p>
            )}
          </Button>
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
              className="p-button-text text-mainGreen dark:text-extraLightGreen hover:text-mainDarkGreen dark:hover:text-lightGreen rounded-xl transition-all"
            />
            <Button
              disabled={isButtonLoading}
              className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen p-4 flex justify-center rounded-xl hover:mainGreen transition-all"
              onClick={handleDelete}
            >
              {isButtonLoading ? (
                <ProgressSpinner
                  style={{ width: "25px", height: "25px" }}
                  strokeWidth="8"
                  animationDuration="1s"
                  color="white"
                />
              ) : (
                <p>Hapus</p>
              )}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DataPengguna;
