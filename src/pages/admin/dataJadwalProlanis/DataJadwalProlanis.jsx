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
import { convertHumanToUnix } from "../../../utils/DateConverter";
import { Calendar } from "primereact/calendar";
import { jadwalProlanisCreateSchemaSuperAdmin } from "../../../validations/JadwalProlanisSchema";
import {
  createJadwalProlanis,
  getAllJadwalProlanis,
} from "../../../services/JadwalProlanisService";
import { ZodError } from "zod";
import { handleApiError } from "../../../utils/ApiErrorHandlers";

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
    waktu_mulai: "",
    waktu_selesai: "",
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [errors, setErrors] = useState({});
  const toast = useRef(null);
  const title = "Jadwal Prolanis";
  const navigate = useNavigate();
  const [isConnectionError, setisConnectionError] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(null);
  const [adminPuskesmas, setAdminPuskesmas] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      //   const response = await getAllPasien();
      //   const sortedData = response.sort(customSort);
      //   setData(sortedData);
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
    setErrors({});
    setDatas({
      idAdminPuskesmas: 0,
      deskripsi: "",
      waktu_mulai: 0,
      waktu_selesai: 0,
    });
    setVisible(true);
    setIsEditMode(false);
    try {
      const responsePuskesmas = await getAllPuskesmas();
      setAdminPuskesmas(responsePuskesmas);
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
      setIsButtonLoading(true);
      jadwalProlanisCreateSchemaSuperAdmin.parse(datas);
      console.log(datas);
      //   const response = await createJadwalProlanis(datas);
      //   if (response.status === 201) {
      //     toast.current.show({
      //       severity: "success",
      //       summary: "Berhasil",
      //       detail: "Data pasien ditambahkan",
      //       life: 3000,
      //     });
      //     setVisible(false);
      //     setIsButtonLoading(false);
      //     try {
      //       setLoading(true);
      //       const response = await getAllJadwalProlanis();
      //       setData(response);
      //       setLoading(false);
      //       setisConnectionError(false);
      //     } catch (error) {
      //       if (
      //         error.code === "ERR_NETWORK" ||
      //         error.code === "ETIMEDOUT" ||
      //         error.code === "ECONNABORTED" ||
      //         error.code === "ENOTFOUND" ||
      //         error.code === "ECONNREFUSED" ||
      //         error.code === "EAI_AGAIN" ||
      //         error.code === "EHOSTUNREACH" ||
      //         error.code === "ECONNRESET" ||
      //         error.code === "EPIPE"
      //       ) {
      //         setisConnectionError(true);
      //       }
      //       HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
      //       setLoading(false);
      //     }
      //   }
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

  const handleModalUpdate = () => {};

  const handleUpdate = () => {};

  const handleModalDelete = () => {};

  //   const handleDelete = () => {};

  const columns = [
    { header: "Deskripsi Kegiatan", field: "judul" },
    { header: "Waktu Mulai", field: "adminPuskesmas.namaPuskesmas" },
    { header: "Waktu Selesai", field: "tanggalPublikasi" },
    { header: "Status", field: "ringkasan" },
  ];

  const statuses = [
    { key: "berlangsung", label: "Berlangsung" },
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
      <div className="bg-white min-h-screen dark:bg-blackHover rounded-xl">
        <ReusableTable
          showDownload={false}
          columns={columns}
          data={data}
          onCreate={handleModalCreate}
          onEdit={handleModalUpdate}
          onDelete={handleModalDelete}
          statuses={statuses}
        />
      </div>

      <Dialog
        header={isEditMode ? "Ubah Data Artikel" : "Tambah Data Artikel"}
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
          {!isEditMode && (
            <>
              <label htmlFor="" className="-mb-3">
                Pilih puskesmas:
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
            </>
          )}

          <label htmlFor="" className="-mb-3">
            Deskripsi Kegiatan:
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
            Waktu Pelaksanaan:
          </label>

          <div className="flex gap-4">
            <div className="flex flex-col ">
              <div className="w-full">
                <Calendar
                  className=" w-full"
                  value={datas.waktu_mulai}
                  onChange={(e) => {
                    setDatas((prev) => ({
                      ...prev,
                      waktu_mulai: e.value,
                    }));
                  }}
                  timeOnly
                  placeholder="Pilih Waktu Mulai"
                  showTime
                />
              </div>
              {errors.waktu_mulai && (
                <small className="p-error text-sm">{errors.waktu_mulai}</small>
              )}
            </div>

            <div className="flex flex-col ">
              <div className="w-full">
                <Calendar
                  className=" w-full"
                  value={datas.waktu_selesai}
                  onChange={(e) => {
                    setDatas((prev) => ({
                      ...prev,
                      waktu_selesai: e.value,
                    }));
                  }}
                  timeOnly
                  placeholder="Pilih Waktu Selesai"
                  showTime
                />
              </div>
              {errors.waktu_selesai && (
                <small className="p-error text-sm">
                  {errors.waktu_selesai}
                </small>
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
    </div>
  );
};

export default DataJadwalProlanis;
