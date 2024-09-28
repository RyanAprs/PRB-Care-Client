import { useContext, useEffect, useRef, useState } from "react";
import ReusableTable from "../../../components/reusableTable/ReusableTable.jsx";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import CustomDropdown from "../../../components/customDropdown/CustomDropdown.jsx";
import {
  convertHumanToUnix,
  convertUnixToHumanForEditData,
  dateLocaleId,
} from "../../../utils/DateConverter";
import { Calendar } from "primereact/calendar";
import { addLocale } from "primereact/api";
import {
  pasienCreateSchema,
  pasienUpdateSchema,
} from "../../../validations/PasienSchema";
import { ZodError } from "zod";
import {
  handleApiError,
  handleDeleteError,
  handleDoneError,
} from "../../../utils/ApiErrorHandlers";
import {
  createPasien,
  deletePasien,
  getAllPasien,
  getPasienById,
  pasienDone,
  updatePasien,
} from "../../../services/PasienService";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { useNavigate } from "react-router-dom";
import { HandleUnauthorizedAdminSuper } from "../../../utils/HandleUnauthorized";
import { AuthContext } from "../../../config/context/AuthContext";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { getAllPengguna } from "../../../services/PenggunaService";
import { getAllPuskesmas } from "../../../services/PuskesmasService";
import ErrorConnection from "../../../components/errorConnection/ErrorConnection";
import ModalLoading from "/src/components/modalLoading/ModalLoading.jsx";
addLocale("id", dateLocaleId);

const DataPasien = () => {
  const [beforeModalLoading, setBeforeModalLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleDone, setVisibleDone] = useState(false);
  const [adminPuskesmas, setAdminPuskesmas] = useState([]);
  const [pengguna, setPengguna] = useState([]);
  const [datas, setDatas] = useState({
    noRekamMedis: "",
    idAdminPuskesmas: "",
    idPengguna: "",
    tanggalDaftar: 0,
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [errors, setErrors] = useState({});
  const toast = useRef(null);
  const title = "Pasien";
  const navigate = useNavigate();
  const [isConnectionError, setisConnectionError] = useState(false);
  const [isButtonLoading, setButtonLoading] = useState(null);
  const customSort = (a, b) => {
    if (a.status < b.status) return -1;
    if (a.status > b.status) return 1;
    if (a.tanggalDaftar < b.tanggalDaftar) return -1;
    if (a.tanggalDaftar > b.tanggalDaftar) return 1;
    return 0;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllPasien();
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

  const handleModalCreate = async () => {
    setVisible(true);
    setErrors({});
    setSelectedDate(null);
    setDatas({
      noRekamMedis: "",
      idAdminPuskesmas: 0,
      idPengguna: 0,
      tanggalDaftar: 0,
    });
    setIsEditMode(false);

    try {
      const responsePuskesmas = await getAllPuskesmas();
      setAdminPuskesmas(responsePuskesmas);
      const responsePengguna = await getAllPengguna();
      setPengguna(responsePengguna);
      setLoading(false);
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
        setVisible(false);
      }
      HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      setButtonLoading(true);
      pasienCreateSchema.parse(datas);
      const response = await createPasien(datas);
      if (response.status === 201) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data pasien ditambahkan",
          life: 3000,
        });
        setVisible(false);
        setButtonLoading(false);
        try {
          setLoading(true);
          const response = await getAllPasien();
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
      } else {
        setVisible(false);
        HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
        handleApiError(error, toast);
      }
    }
  };

  const handleCalendarChange = (e) => {
    setSelectedDate(e.value);
    const unixTimestamp = convertHumanToUnix(e.value);
    setDatas((prev) => ({
      ...prev,
      tanggalDaftar: unixTimestamp,
    }));
  };

  const handleModalUpdate = async (data) => {
    setBeforeModalLoading(true);
    setErrors({});
    try {
      const responsePuskesmas = await getAllPuskesmas();
      setAdminPuskesmas(responsePuskesmas);

      const responsePengguna = await getAllPengguna();
      setPengguna(responsePengguna);

      setLoading(false);
    } catch (error) {
      HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
      setLoading(false);
    }

    try {
      const dataResponse = await getPasienById(data.id);
      if (dataResponse) {
        const convertDate = convertUnixToHumanForEditData(
          dataResponse.tanggalDaftar
        );
        setSelectedDate(convertDate);
        setDatas({
          noRekamMedis: dataResponse.noRekamMedis,
          idAdminPuskesmas: dataResponse.idAdminPuskesmas,
          idPengguna: dataResponse.idPengguna,
          tanggalDaftar: dataResponse.tanggalDaftar,
        });
        setCurrentId(data.id);
        setIsEditMode(true);
        setVisible(true);
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
      pasienUpdateSchema.parse(datas);
      const response = await updatePasien(currentId, datas);
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data pasien diperbarui",
          life: 3000,
        });
        setVisible(false);
        setButtonLoading(false);
        try {
          setLoading(true);
          const response = await getAllPasien();
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
    setCurrentName(data.noRekamMedis);
    setVisibleDelete(true);
    setBeforeModalLoading(false);
  };

  const handleDelete = async () => {
    try {
      setButtonLoading(true);
      const response = await deletePasien(currentId);
      if (response.status === 200) {
        setVisibleDelete(false);
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data pasien dihapus",
          life: 3000,
        });
        try {
          setLoading(true);
          const response = await getAllPasien();
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
      HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
      handleDeleteError(error, toast, title);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleModalDone = async (data) => {
    setBeforeModalLoading(true);
    setCurrentId(data.id);
    setCurrentName(data.noRekamMedis);
    setVisibleDone(true);
    setBeforeModalLoading(false);
  };

  const handleDone = async () => {
    try {
      setButtonLoading(true);
      const response = await pasienDone(currentId);
      if (response.status === 200) {
        setVisibleDone(false);
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Pasien berhasil diselesaikan",
          life: 3000,
        });
        try {
          setLoading(true);
          const response = await getAllPasien();
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
      HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
      handleDoneError(error, toast);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();

    doc.text("Data Pasien", 20, 10);

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

    doc.save("data-pasien.pdf");
  };

  const columns = [
    { header: "Nomor Rekam Medis", field: "noRekamMedis" },
    { header: "Nama Pasien", field: "pengguna.namaLengkap" },
    { header: "Puskesmas", field: "adminPuskesmas.namaPuskesmas" },
    { header: "Tanggal Periksa", field: "tanggalDaftar" },
    { header: "Status", field: "status" },
  ];

  const statuses = [
    { key: "aktif", label: "Aktif" },
    { key: "selesai", label: "Selesai" },
  ];

  const itemTemplatePengguna = (option) => {
    return (
      <div>
        {option.namaLengkap} - {option.telepon}
      </div>
    );
  };

  const valueTemplatePengguna = (option) => {
    if (option) {
      return (
        <div>
          {option.namaLengkap} - {option.telepon}
        </div>
      );
    }
    return <span>Pilih Pasien</span>;
  };

  const itemTemplatePuskesmas = (option) => {
    return (
      <div>
        {option.namaPuskesmas} - {option.telepon}
      </div>
    );
  };

  const valueTemplatePuskesmas = (option) => {
    if (option) {
      return (
        <div>
          {option.namaPuskesmas} - {option.telepon}
        </div>
      );
    }
    return <span>Pilih Puskesmas</span>;
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col gap-4 p-4 z-10 ">
        <Toast
          ref={toast}
          position={window.innerWidth <= 767 ? "top-center" : "top-right"}
        />
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
      <Toast
        ref={toast}
        position={window.innerWidth <= 767 ? "top-center" : "top-right"}
      />
      <ModalLoading className={beforeModalLoading ? `` : `hidden`} />
      <div className="bg-white min-h-screen dark:bg-blackHover rounded-xl">
        <ReusableTable
          columns={columns}
          data={data}
          onCreate={handleModalCreate}
          onEdit={handleModalUpdate}
          onDelete={handleModalDelete}
          onDone={handleModalDone}
          statuses={statuses}
          onDownload={handleDownload}
        />
      </div>
      <Dialog
        header={isEditMode ? "Ubah Data Pasien" : "Tambah Data Pasien"}
        visible={visible}
        maximizable
        className="md:w-1/2 w-full "
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        blockScroll={true}
      >
        <div className="flex flex-col p-4 gap-4">
          <label htmlFor="" className="-mb-3">
            Nomor Rekam Medis:
          </label>

          <InputText
            type="text"
            placeholder="Nomor Rekam Medis"
            className="p-input text-lg p-3  rounded"
            value={datas.noRekamMedis}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                noRekamMedis: e.target.value,
              }))
            }
          />
          {errors.noRekamMedis && (
            <small className="p-error -mt-3 text-sm">
              {errors.noRekamMedis}
            </small>
          )}
          <label htmlFor="" className="-mb-3">
            Pilih Pengguna:
          </label>

          <CustomDropdown
            value={
              pengguna.find((pengguna) => pengguna.id === datas.idPengguna) ||
              null
            }
            options={pengguna}
            filter
            optionLabel="namaLengkap"
            itemTemplate={itemTemplatePengguna}
            valueTemplate={valueTemplatePengguna}
            placeholder="Pilih Pengguna"
            className=" p-2 rounded"
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                idPengguna: e.value.id,
              }))
            }
          />
          {errors.idPengguna && (
            <small className="p-error -mt-3 text-sm">{errors.idPengguna}</small>
          )}
          <label htmlFor="" className="-mb-3">
            Pilih Puskesmas:
          </label>

          <CustomDropdown
            value={
              adminPuskesmas && adminPuskesmas.length > 0
                ? adminPuskesmas.find(
                    (puskesmas) => puskesmas.id === datas.idAdminPuskesmas
                  ) || null
                : null
            }
            filter
            options={adminPuskesmas || []}
            optionLabel="namaPuskesmas"
            itemTemplate={itemTemplatePuskesmas}
            valueTemplate={valueTemplatePuskesmas}
            placeholder="Pilih Puskesmas"
            className="p-2 rounded"
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                idAdminPuskesmas: e.value.id,
              }))
            }
          />

          {errors.idAdminPuskesmas && (
            <small className="p-error -mt-3 text-sm">
              {errors.idAdminPuskesmas}
            </small>
          )}

          <label htmlFor="" className="-mb-3">
            Tanggal Periksa:
          </label>

          <Calendar
            id="buttondisplay"
            className="p-input text-lg rounded"
            placeholder="Pilih Tanggal Periksa"
            value={selectedDate}
            onChange={handleCalendarChange}
            showIcon
            locale="id"
            showButtonBar
            readOnlyInput
            hideOnRangeSelection
          />

          {errors.tanggalDaftar && (
            <small className="p-error -mt-3 text-sm">
              {errors.tanggalDaftar}
            </small>
          )}
          <Button
            disabled={isButtonLoading}
            className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen p-4 w-full flex justify-center rounded-xl hover:mainGreen transition-all"
            onClick={isEditMode ? handleUpdate : handleCreate}
          >
            {isButtonLoading ? (
              <ProgressSpinner
                style={{ width: "24px", height: "24px" }}
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
        header="Hapus Data Pasien"
        visible={visibleDelete}
        className="md:w-1/2 w-full "
        onHide={() => {
          if (!visibleDelete) return;
          setVisibleDelete(false);
        }}
        blockScroll={true}
      >
        <div className="flex flex-col gap-8">
          <div className="text-xl">
            Apakah anda yakin ingin menghapus data dengan nomor rekam medis{" "}
            {currentName}?
          </div>
          <div className="flex gap-4 items-end justify-end">
            <Button
              label="Batal"
              onClick={() => setVisibleDelete(false)}
              className="p-button-text text-mainGreen dark:text-extraLightGreen hover:text-mainDarkGreen dark:hover:text-lightGreen rounded-xl transition-all"
            />
            <Button
              disabled={isButtonLoading}
              className="bg-mainGreen w-[85px] items-center justify-center text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen flex rounded-xl transition-all"
              onClick={handleDelete}
            >
              {isButtonLoading ? (
                <ProgressSpinner
                  style={{ width: "24px", height: "24px" }}
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

      <Dialog
        header="Pasien Selesai"
        visible={visibleDone}
        className="md:w-1/2 w-full "
        onHide={() => {
          if (!visibleDone) return;
          setVisibleDone(false);
        }}
        blockScroll={true}
      >
        <div className="flex flex-col gap-8">
          <div className="text-xl">
            Apakah Anda yakin ingin menyelesaikan pasien {currentName}?. Dengan
            menekan {"Selesai"}, pasien tidak akan melakukan kontrol kembali
            atau mengambil obat lagi.
          </div>
          <div className="flex gap-4 items-end justify-end">
            <Button
              label="Batal"
              onClick={() => setVisibleDone(false)}
              className="p-button-text text-mainGreen dark:text-extraLightGreen hover:text-mainDarkGreen dark:hover:text-lightGreen rounded-xl transition-all"
            />
            <Button
              disabled={isButtonLoading}
              className="bg-mainGreen w-[85px] items-center justify-center text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen flex rounded-xl transition-all"
              onClick={handleDone}
            >
              {isButtonLoading ? (
                <ProgressSpinner
                  style={{ width: "24px", height: "24px" }}
                  strokeWidth="8"
                  animationDuration="1s"
                  color="white"
                />
              ) : (
                <p>Selesai</p>
              )}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DataPasien;
