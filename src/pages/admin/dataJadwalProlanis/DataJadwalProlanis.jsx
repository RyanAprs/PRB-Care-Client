import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../config/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import ReusableTable from "../../../components/reusableTable/ReusableTable";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import CustomDropdown from "../../../components/customDropdown/CustomDropdown";
import { Dialog } from "primereact/dialog";
import { getAllPuskesmas } from "../../../services/PuskesmasService";
import { HandleUnauthorizedAdminSuper } from "../../../utils/HandleUnauthorized";
import { InputTextarea } from "primereact/inputtextarea";
import ErrorConnection from "../../../components/errorConnection/ErrorConnection";
import {
  convertHumanToUnix,
  convertUnixToHumanForEditData,
} from "../../../utils/DateConverter";
import { Calendar } from "primereact/calendar";
import { jadwalProlanisCreateSchemaSuperAdmin } from "../../../validations/JadwalProlanisSchema";
import {
  createJadwalProlanis,
  deleteJadwalProlanis,
  getAllJadwalProlanis,
  getJadwalProlanisById,
  JadwalProlanisDone,
  updateJadwalProlanis,
} from "../../../services/JadwalProlanisService";
import { ZodError } from "zod";
import { handleApiError } from "../../../utils/ApiErrorHandlers";
import ModalLoading from "../../../components/modalLoading/ModalLoading";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DataJadwalProlanis = () => {
  const [beforeModalLoading, setBeforeModalLoading] = useState(false);
  const { dispatch, token } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [datas, setDatas] = useState({
    idAdminPuskesmas: "",
    deskripsi: "",
    waktuMulai: 0,
    waktuSelesai: 0,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [errors, setErrors] = useState({});
  const toast = useRef(null);
  const navigate = useNavigate();
  const [isConnectionError, setisConnectionError] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(null);
  const [adminPuskesmas, setAdminPuskesmas] = useState([]);
  const [selectedWaktuMulai, setSelectedWaktuMulai] = useState(null);
  const [selectedWaktuSelesai, setSelectedWaktuSelesai] = useState(null);
  const [visibleDone, setVisibleDone] = useState(false);

  const customSort = (a, b) => {
    const statusOrder = ["aktif", "selesai"];

    if (statusOrder.indexOf(a.status) < statusOrder.indexOf(b.status))
      return -1;
    if (statusOrder.indexOf(a.status) > statusOrder.indexOf(b.status)) return 1;
    if (a.waktuMulai < b.waktuMulai) return 1;
    if (a.waktuMulai > b.waktuMulai) return -1;

    return 0;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllJadwalProlanis();
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
    setBeforeModalLoading(true);
    setErrors({});
    setSelectedWaktuMulai(null);
    setSelectedWaktuSelesai(null);
    setDatas({
      idAdminPuskesmas: 0,
      deskripsi: "",
      waktuMulai: 0,
      waktuSelesai: 0,
    });
    try {
      const responsePuskesmas = await getAllPuskesmas();
      setAdminPuskesmas(responsePuskesmas);
      setIsEditMode(false);
      setVisible(true);
    } catch (error) {
      HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
      handleApiError(error, toast);
    }
    setBeforeModalLoading(false);
  };

  const handleCreate = async () => {
    try {
      setIsButtonLoading(true);
      jadwalProlanisCreateSchemaSuperAdmin.parse(datas);
      const response = await createJadwalProlanis(datas);
      if (response.status === 201) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data prolanis ditambahkan",
          life: 3000,
        });
        setVisible(false);
        setIsButtonLoading(false);
        try {
          setLoading(true);
          const response = await getAllJadwalProlanis();
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
      setIsButtonLoading(false);
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

  const handleModalUpdate = async (data) => {
    setBeforeModalLoading(true);
    setErrors({});
    try {
      const response = await getAllPuskesmas();
      setAdminPuskesmas(response);

      const dataResponse = await getJadwalProlanisById(data.id);
      if (dataResponse) {
        const convertDate = {
          waktuMulai: convertUnixToHumanForEditData(dataResponse.waktuMulai),
          waktuSelesai: convertUnixToHumanForEditData(
            dataResponse.waktuSelesai
          ),
        };
        setSelectedWaktuMulai(convertDate.waktuMulai);
        setSelectedWaktuSelesai(convertDate.waktuSelesai);

        setDatas({
          idAdminPuskesmas: dataResponse.idAdminPuskesmas,
          deskripsi: dataResponse.deskripsi,
          waktuMulai: dataResponse.waktuMulai,
          waktuSelesai: dataResponse.waktuSelesai,
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
      setIsButtonLoading(true);

      jadwalProlanisCreateSchemaSuperAdmin.parse(datas);
      const response = await updateJadwalProlanis(currentId, datas);
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data poralis diperbarui",
          life: 3000,
        });

        setVisible(false);
        setIsButtonLoading(false);
        try {
          setLoading(true);
          const response = await getAllJadwalProlanis();
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
      setIsButtonLoading(false);
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

  const handleModalDelete = (data) => {
    setBeforeModalLoading(true);
    setVisibleDelete(true);
    setCurrentId(data.id);
    setBeforeModalLoading(false);
  };

  const handleDelete = async () => {
    try {
      setIsButtonLoading(true);
      const response = await deleteJadwalProlanis(currentId);
      if (response.status === 200) {
        setVisibleDelete(false);
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data prolanis dihapus",
          life: 3000,
        });
        try {
          setLoading(true);
          const response = await getAllJadwalProlanis();
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
      handleApiError(error, toast);
    } finally {
      setVisibleDelete(false);
      setIsButtonLoading(false);
    }
  };

  const handleModalDone = async (data) => {
    setBeforeModalLoading(true);
    setCurrentId(data.id);
    setVisibleDone(true);
    setBeforeModalLoading(false);
  };

  const handleDone = async () => {
    try {
      setIsButtonLoading(true);
      const response = await JadwalProlanisDone(currentId);
      if (response.status === 200) {
        setVisibleDone(false);
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Jadwal prolanis selesai!",
          life: 3000,
        });
        try {
          setLoading(true);
          const response = await getAllJadwalProlanis();
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
      handleApiError(error, toast);
    } finally {
      setVisibleDone(false);
      setIsButtonLoading(false);
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();

    doc.text("Data Prolanis", 20, 10);

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

    doc.save("data-prolanis.pdf");
  };

  const columns = [
    { header: "Deskripsi Kegiatan", field: "deskripsi" },
    { header: "Puskesmas", field: "adminPuskesmas.namaPuskesmas" },
    { header: "Waktu Mulai", field: "waktuMulai" },
    { header: "Waktu Selesai", field: "waktuSelesai" },
    { header: "Status", field: "status" },
  ];

  const statuses = [
    { key: "aktif", label: "Aktif" },
    { key: "selesai", label: "Selesai" },
  ];

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
          onDownload={handleDownload}
          statuses={statuses}
          role={"admin"}
        />
      </div>

      <Dialog
        header={isEditMode ? "Ubah Data Prolanis" : "Tambah Data Prolanis"}
        visible={visible}
        maximizable
        className="md:w-1/2 w-full"
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        blockScroll={true}
      >
        <div className="flex flex-col p-4 gap-4">
          <label htmlFor="" className="-mb-3">
            Pilih Puskesmas
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
            Deskripsi Kegiatan
          </label>

          <InputTextarea
            autoResize
            type="text"
            placeholder="Deskripsi Kegiatan"
            className="p-input text-lg p-3  rounded"
            value={datas.deskripsi}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                deskripsi: e.target.value,
              }))
            }
          />

          {errors.deskripsi && (
            <small className="p-error -mt-3 text-sm">{errors.deskripsi}</small>
          )}

          <label htmlFor="" className="-mb-3">
            Waktu Pelaksanaan
          </label>

          <div className="flex gap-4 md:flex-row flex-col">
            <div className="flex flex-col md:w-1/2 w-full">
              <div className="w-full">
                <Calendar
                  className=" w-full"
                  value={selectedWaktuMulai}
                  onChange={(e) => {
                    setSelectedWaktuMulai(e.value);
                    const convertDate = convertHumanToUnix(e.value);
                    setDatas((prev) => ({
                      ...prev,
                      waktuMulai: convertDate,
                    }));
                  }}
                  placeholder="Pilih Waktu Mulai"
                  showTime
                  hourFormat="24"
                  locale="id"
                />
              </div>
              {errors.waktuMulai && (
                <small className="p-error text-sm">{errors.waktuMulai}</small>
              )}
            </div>

            <div className="flex flex-col md:w-1/2 w-full">
              <div className="w-full">
                <Calendar
                  className=" w-full"
                  value={selectedWaktuSelesai}
                  onChange={(e) => {
                    setSelectedWaktuSelesai(e.value);

                    const convertDate = convertHumanToUnix(e.value);
                    setDatas((prev) => ({
                      ...prev,
                      waktuSelesai: convertDate,
                    }));
                  }}
                  placeholder="Pilih Waktu Selesai"
                  showTime
                  hourFormat="24"
                  locale="id"
                />
              </div>
              {errors.waktuSelesai && (
                <small className="p-error text-sm">{errors.waktuSelesai}</small>
              )}
            </div>
          </div>

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
        header="Hapus Data prolanis"
        visible={visibleDelete}
        className="md:w-1/2 w-full"
        onHide={() => {
          if (!visibleDelete) return;
          setVisibleDelete(false);
        }}
        blockScroll={true}
      >
        <div className="flex flex-col gap-8">
          <div className="text-xl">
            Apakah anda yakin ingin menghapus jadwal ini?
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
        header="Pasien Selesai prolanis"
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
            Apakah Anda yakin ingin menyelesaikan jadwal ini?
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

export default DataJadwalProlanis;
