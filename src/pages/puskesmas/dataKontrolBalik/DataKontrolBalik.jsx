import { useContext, useEffect, useRef, useState } from "react";
import ReusableTable from "../../../components/reusableTable/ReusableTable.jsx";
import {
  convertHumanToUnix,
  convertUnixToHumanForEditData,
} from "../../../utils/DateConverter";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import CustomDropdown from "../../../components/customDropdown/CustomDropdown.jsx";
import { Toast } from "primereact/toast";
import {
  createKontrolBalik,
  deleteKontrolBalik,
  getAllKontrolBalik,
  getKontrolBalikById,
  kontrolBalikCancelled,
  kontrolBalikDone,
  updateKontrolBalik,
} from "../../../services/KontrolBalikService";
import {
  kontrolBalikCreateSchema,
  kontrolBalikUpdateSchema,
} from "../../../validations/KontrolBalikSchema";
import { ZodError } from "zod";
import {
  handleKontrolBalikError,
  handleDeleteError,
  handleDoneError,
} from "../../../utils/ApiErrorHandlers";
import { getAllPasienAktif } from "../../../services/PasienService";
import { useNavigate } from "react-router-dom";
import { HandleUnauthorizedAdminPuskesmas } from "../../../utils/HandleUnauthorized";
import { AuthContext } from "../../../config/context/AuthContext";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import ErrorConnection from "../../../components/errorConnection/ErrorConnection";
import ModalLoading from "/src/components/modalLoading/ModalLoading.jsx";
import { InputNumber } from "primereact/inputnumber";
const DataKontrolBalik = () => {
  const [beforeModalLoading, setBeforeModalLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState({
    idPasien: "",
    tinggiBadan: 0,
    beratBadan: 0,
    tekananDarah: "",
    denyutNadi: 0,
    hasilLab: "",
    hasilEkg: "",
    hasilDiagnosa: "",
    keluhan: "",
    tanggalKontrol: 0,
  });
  const [selesaiEditMode, setSelesaiEditMode] = useState(false);
  const [pasien, setPasien] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleDone, setVisibleDone] = useState(false);
  const [visibleCancelled, setVisibleCancelled] = useState(false);
  const { token } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [errors, setErrors] = useState({});
  const toast = useRef(null);
  const title = "Kontrol Balik";
  const navigate = useNavigate();
  const [isConnectionError, setisConnectionError] = useState(false);
  const [isButtonLoading, setButtonLoading] = useState(null);
  const customSort = (a, b) => {
    const statusOrder = ["menunggu", "selesai", "batal"];

    if (statusOrder.indexOf(a.status) < statusOrder.indexOf(b.status))
      return -1;
    if (statusOrder.indexOf(a.status) > statusOrder.indexOf(b.status)) return 1;

    if (a.pasien.tanggalKontrol < b.pasien.tanggalKontrol) return -1;
    if (a.pasien.tanggalKontrol > b.pasien.tanggalKontrol) return 1;

    return 0;
  };
  const [dataPasien, setDataPasien] = useState({
    noRekamMedis: "",
    namaLengkap: "",
    telepon: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllKontrolBalik();
      const sortedData = response.sort(customSort);
      setData(sortedData);
      setisConnectionError(false);
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
      }
      HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, navigate, dispatch]);

  const handleModalCreate = async () => {
    setBeforeModalLoading(true);
    setErrors({});
    setSelectedDate(null);
    setDatas({
      idPasien: 0,
      tinggiBadan: 0,
      beratBadan: 0,
      tekananDarah: "",
      denyutNadi: 0,
      hasilLab: "",
      hasilEkg: "",
      hasilDiagnosa: "",
      keluhan: "",
      tanggalKontrol: 0,
    });
    
    try {
      const response = await getAllPasienAktif();
      setPasien(response);
      setIsEditMode(false);
      setSelesaiEditMode(false);
      setVisible(true);
    } catch (error) {
      HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
      handleKontrolBalikError(error, toast);
    }
    setBeforeModalLoading(false);
  };

  const handleCreate = async () => {
    try {
      setButtonLoading(true);
      kontrolBalikCreateSchema.parse(datas);
      const response = await createKontrolBalik(datas);
      if (response.status === 201) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data kontrol balik ditambahkan",
          life: 3000,
        });
        setVisible(false);
        setButtonLoading(false);
        try {
          setLoading(true);
          const response = await getAllKontrolBalik();
          const sortedData = response.sort(customSort);
          setData(sortedData);
          setisConnectionError(false);
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
          }
          HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
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
        HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        handleKontrolBalikError(error, toast);
      }
    }
  };

  const handleCalendarChange = (e) => {
    setSelectedDate(e.value);
    const unixTimestamp = convertHumanToUnix(e.value);
    setDatas((prev) => ({
      ...prev,
      tanggalKontrol: unixTimestamp,
    }));
  };

  const handleModalUpdate = async (data) => {
    setBeforeModalLoading(true);
    setErrors({});
    try {
      const response = await getAllPasienAktif();
      setPasien(response);
      const dataResponse = await getKontrolBalikById(data.id);
      if (dataResponse) {
        const convertDate = convertUnixToHumanForEditData(
          dataResponse.tanggalKontrol
        );
        setSelectedDate(convertDate);
        setDatas({
          idPasien: dataResponse.idPasien,
          tanggalKontrol: dataResponse.tanggalKontrol,
          tinggiBadan: dataResponse.tinggiBadan,
          beratBadan: dataResponse.beratBadan,
          tekananDarah: dataResponse.tekananDarah,
          denyutNadi: dataResponse.denyutNadi,
          hasilLab: dataResponse.hasilLab,
          hasilEkg: dataResponse.hasilEkg,
          hasilDiagnosa: dataResponse.hasilDiagnosa,
          keluhan: dataResponse.keluhan,
        });
        setCurrentId(data.id);
        setIsEditMode(true);
        setSelesaiEditMode(false);
        setVisible(true);
      }
    } catch (error) {
      HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
      handleKontrolBalikError(error, toast);
    }
    setBeforeModalLoading(false);
  };

  const handleModalSelesaiUpdate = async (data) => {
    setBeforeModalLoading(true);
    setErrors({});
    try {
      const dataResponse = await getKontrolBalikById(data.id);
      if (dataResponse) {
        const convertDate = convertUnixToHumanForEditData(
          dataResponse.tanggalKontrol
        );
        setSelectedDate(convertDate);
        setDatas({
          idPasien: dataResponse.idPasien,
          tanggalKontrol: dataResponse.tanggalKontrol,
          tinggiBadan: dataResponse.tinggiBadan,
          beratBadan: dataResponse.beratBadan,
          tekananDarah: dataResponse.tekananDarah,
          denyutNadi: dataResponse.denyutNadi,
          hasilLab: dataResponse.hasilLab,
          hasilEkg: dataResponse.hasilEkg,
          hasilDiagnosa: dataResponse.hasilDiagnosa,
          keluhan: dataResponse.keluhan,
        });

        setDataPasien(
          {
            noRekamMedis: dataResponse.pasien.noRekamMedis,
            namaLengkap: dataResponse.pasien.pengguna.namaLengkap,
            telepon: dataResponse.pasien.pengguna.telepon,
          }
        );

        setCurrentId(data.id);
        setSelesaiEditMode(true);
        setIsEditMode(true);
        setVisible(true);
      }
    } catch (error) {
      HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
      handleApiError(error, toast);
    }
    setBeforeModalLoading(false);
  };

  const handleUpdate = async () => {
    try {
      setButtonLoading(true);
      kontrolBalikUpdateSchema.parse(datas);
      const response = await updateKontrolBalik(currentId, datas);
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data kontrol balik diperbarui",
          life: 3000,
        });

        setVisible(false);
        setButtonLoading(false);
        try {
          setLoading(true);
          const response = await getAllKontrolBalik();
          const sortedData = response.sort(customSort);
          setData(sortedData);
          setisConnectionError(false);
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
          }
          HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
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
        handleKontrolBalikError(error, toast);
      } else {
        setVisible(false);
        HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        handleKontrolBalikError(error, toast);
      }
    }
  };

  const handleModalDelete = (data) => {
    setBeforeModalLoading(true);
    setVisibleDelete(true);
    setCurrentId(data.id);
    setCurrentName(data.pasien.pengguna.namaLengkap);
    setBeforeModalLoading(false);
  };

  const handleDelete = async () => {
    try {
      setButtonLoading(true);
      const response = await deleteKontrolBalik(currentId);
      if (response.status === 200) {
        setVisibleDelete(false);
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data kontrol balik dihapus",
          life: 3000,
        });
        try {
          setLoading(true);
          const response = await getAllKontrolBalik();
          const sortedData = response.sort(customSort);
          setData(sortedData);
          setisConnectionError(false);
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
          }
          HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
          setLoading(false);
        }
      }
    } catch (error) {
      HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
      handleDeleteError(error, toast, title);
    } finally {
      setVisibleDelete(false);
      setButtonLoading(false);
    }
  };

  const handleModalDone = async (data) => {
    setBeforeModalLoading(true);
    setCurrentId(data.id);
    setCurrentName(data.pasien.pengguna.namaLengkap);
    setVisibleDone(true);
    setBeforeModalLoading(false);
  };

  const handleDone = async () => {
    try {
      setButtonLoading(true);
      const response = await kontrolBalikDone(currentId);
      if (response.status === 200) {
        setVisibleDone(false);
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Kontrol balik berhasil diselesaikan dari kontrol balik",
          life: 3000,
        });
        try {
          setLoading(true);
          const response = await getAllKontrolBalik();
          const sortedData = response.sort(customSort);
          setData(sortedData);
          setisConnectionError(false);
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
          }
          HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
          setLoading(false);
        }
      }
    } catch (error) {
      HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
      handleDoneError(error, toast);
    } finally {
      setVisibleDone(false);
      setButtonLoading(false);
    }
  };

  const handleModalCancelled = async (data) => {
    setBeforeModalLoading(true);
    setCurrentId(data.id);
    setCurrentName(data.pasien.pengguna.namaLengkap);
    setVisibleCancelled(true);
    setBeforeModalLoading(false);
  };

  const handleCancelled = async () => {
    try {
      setButtonLoading(true);
      const response = await kontrolBalikCancelled(currentId);
      if (response.status === 200) {
        setVisibleCancelled(false);
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Pasien berhasil dibatalkan dari kontrol balik",
          life: 3000,
        });
        try {
          setLoading(true);
          const response = await getAllKontrolBalik();
          const sortedData = response.sort(customSort);
          setData(sortedData);
          setisConnectionError(false);
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
          }
          HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
          setLoading(false);
        }
      }
    } catch (error) {
      HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
      handleDoneError(error, toast);
    } finally {
      setVisibleCancelled(false);
      setButtonLoading(false);
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();

    doc.text("Data Kontrol Balik", 20, 10);

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

    doc.save("data-kontrol-balik.pdf");
  };

  const columns = [
    { header: "Tanggal Kontrol", field: "tanggalKontrol" },
    { header: "Nama Pasien", field: "pasien.pengguna.namaLengkap" },
    { header: "No Rekam Medis", field: "pasien.noRekamMedis" },
    { header: "Keluhan", field: "keluhan" },
    { header: "Berat Badan", field: "beratBadan" },
    { header: "Tinggi Badan", field: "tinggiBadan" },
    { header: "Denyut Nadi", field: "denyutNadi" },
    { header: "Tekanan Darah", field: "tekananDarah" },
    { header: "Hasil LAB", field: "hasilLab" },
    { header: "Hasil EKG", field: "hasilEkg" },
    { header: "Hasil Diagnosa", field: "hasilDiagnosa" },
    { header: "Status", field: "status" },
  ];

  const statuses = [
    { key: "menunggu", label: "Menunggu" },
    { key: "selesai", label: "Selesai" },
    { key: "batal", label: "Batal" },
  ];

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

  const itemTemplate = (option) => {
    return (
      <div>
        {option.pengguna.namaLengkap} - {option.noRekamMedis}
      </div>
    );
  };

  if (isConnectionError) {
    return <ErrorConnection fetchData={fetchData} />;
  }

  const valueTemplate = (option) => {
    if (option) {
      return (
        <div>
          {option.pengguna.namaLengkap} - {option.noRekamMedis}
        </div>
      );
    }
    return <span>Pilih Pasien</span>;
  };

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
          onCancelled={handleModalCancelled}
          onEditKontrolSelesai={handleModalSelesaiUpdate}
          statuses={statuses}
          role="admin"
          path={"kontrol"}
          onDownload={handleDownload}
        />
      </div>

      <Dialog
        header={
          isEditMode ? "Ubah Data Kontrol Balik" : "Tambah Data Kontrol Balik"
        }
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
        {selesaiEditMode ? (
              <>
                <label htmlFor="" className="-mb-3">
            Nama Pasien
          </label>
          <InputText
                type="text"
                disabled
                className="p-input text-lg p-3  rounded"
                value={`${dataPasien.namaLengkap} - ${dataPasien.noRekamMedis}`}
              />
              </>
            ) : (
          <>
          <label htmlFor="" className="-mb-3">
            Pilih Pasien
          </label>

          <CustomDropdown
            value={pasien.find((p) => p.id === datas.idPasien) || null}
            options={pasien}
            filter
            optionLabel="pengguna.namaLengkap"
            valueTemplate={valueTemplate}
            itemTemplate={itemTemplate}
            placeholder="Pilih Pasien"
            className=" p-2 rounded"
            onChange={(e) => {
              const selectedPasien = e.value;
              setDatas((prev) => ({
                ...prev,
                idPasien: selectedPasien.id,
              }));
            }}
          /></>)}

          {errors.idPasien && (
            <small className="p-error -mt-3 text-sm">{errors.idPasien}</small>
          )}

          {isEditMode && (
            <>
              <label htmlFor="" className="-mb-3">
                Keluhan
              </label>

              <InputTextarea
                autoResize
                type="text"
                placeholder="Keluhan"
                className="p-input text-lg p-3  rounded"
                value={datas.keluhan}
                onChange={(e) =>
                  setDatas((prev) => ({
                    ...prev,
                    keluhan: e.target.value,
                  }))
                }
              />
              <label htmlFor="" className="-mb-3">
                Tinggi Badan
              </label>

              <InputNumber
                useGrouping={false}
                showButtons
                min={0}
                placeholder="Tinggi Badan"
                className="p-input text-lg rounded"
                value={datas.tinggiBadan}
                onChange={(e) =>
                  setDatas((prev) => ({
                    ...prev,
                    tinggiBadan: parseInt(e.value, 10) || 0,
                  }))
                }
              />
              {errors.tinggiBadan && (
                <small className="p-error -mt-3 text-sm">
                  {errors.tinggiBadan}
                </small>
              )}
              <label htmlFor="" className="-mb-3">
                Berat Badan
              </label>

              <InputNumber
                useGrouping={false}
                showButtons
                min={0}
                placeholder="Berat Badan"
                className="p-input text-lg rounded"
                value={datas.beratBadan}
                onChange={(e) =>
                  setDatas((prev) => ({
                    ...prev,
                    beratBadan: parseInt(e.value, 10) || 0,
                  }))
                }
              />
              {errors.beratBadan && (
                <small className="p-error -mt-3 text-sm">
                  {errors.beratBadan}
                </small>
              )}
              <label htmlFor="" className="-mb-3">
                Tekanan Darah
              </label>

              <InputText
                type="text"
                placeholder="Tekanan Darah"
                className="p-input text-lg p-3  rounded"
                value={datas.tekananDarah}
                onChange={(e) =>
                  setDatas((prev) => ({
                    ...prev,
                    tekananDarah: e.target.value,
                  }))
                }
              />
              {errors.tekananDarah && (
                <small className="p-error -mt-3 text-sm">
                  {errors.tekananDarah}
                </small>
              )}
              <label htmlFor="" className="-mb-3">
                Denyut Nadi
              </label>

              <InputNumber
                useGrouping={false}
                showButtons
                min={0}
                placeholder="Denyut Nadi"
                className="p-input text-lg rounded"
                value={datas.denyutNadi}
                onChange={(e) =>
                  setDatas((prev) => ({
                    ...prev,
                    denyutNadi: parseInt(e.value, 10) || 0,
                  }))
                }
              />
              {errors.denyutNadi && (
                <small className="p-error -mt-3 text-sm">
                  {errors.denyutNadi}
                </small>
              )}
              <label htmlFor="" className="-mb-3">
                Hasil Lab
              </label>

              <InputTextarea
                autoResize
                type="text"
                placeholder="Hasil Lab"
                className="p-input text-lg p-3  rounded"
                value={datas.hasilLab}
                onChange={(e) =>
                  setDatas((prev) => ({
                    ...prev,
                    hasilLab: e.target.value,
                  }))
                }
              />
              {errors.hasilLab && (
                <small className="p-error -mt-3 text-sm">
                  {errors.hasilLab}
                </small>
              )}
              <label htmlFor="" className="-mb-3">
                Hasil EKG
              </label>

              <InputTextarea
                autoResize
                type="text"
                placeholder="Hasil EKG"
                className="p-input text-lg p-3  rounded"
                value={datas.hasilEkg}
                onChange={(e) =>
                  setDatas((prev) => ({
                    ...prev,
                    hasilEkg: e.target.value,
                  }))
                }
              />
              {errors.hasilEkg && (
                <small className="p-error -mt-3 text-sm">
                  {errors.hasilEkg}
                </small>
              )}
              <label htmlFor="" className="-mb-3">
                Hasil Diagnosa
              </label>

              <InputTextarea
                autoResize
                type="text"
                placeholder="Hasil Diagnosa"
                className="p-input text-lg p-3  rounded"
                value={datas.hasilDiagnosa}
                onChange={(e) =>
                  setDatas((prev) => ({
                    ...prev,
                    hasilDiagnosa: e.target.value,
                  }))
                }
              />
              {errors.hasilDiagnosa && (
                <small className="p-error -mt-3 text-sm">
                  {errors.hasilDiagnosa}
                </small>
              )}

              {errors.keluhan && (
                <small className="p-error -mt-3 text-sm">
                  {errors.keluhan}
                </small>
              )}
            </>
          )}

          <label htmlFor="" className="-mb-3">
            Tanggal Kontrol{" "}
          </label>

          <Calendar
            id="buttondisplay"
            className="p-input text-lg rounded"
            placeholder="Pilih Tanggal Kontrol"
            value={selectedDate}
            onChange={handleCalendarChange}
            showIcon
            locale="id"
            showButtonBar
            readOnlyInput
            hideOnRangeSelection
          />

          {errors.tanggalKontrol && (
            <small className="p-error -mt-3 text-sm">
              {errors.tanggalKontrol}
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
        header="Hapus Data Kontrol Balik"
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
            Apakah anda yakin ingin menghapus data {currentName} dari kontrol
            balik?
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
        header="Pasien Selesai Kontrol Balik"
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
            Apakah Anda yakin ingin menyelesaikan pasien {currentName} dari
            kontrol balik?
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

      <Dialog
        header="Pasien Batal Kontrol Balik"
        visible={visibleCancelled}
        className="md:w-1/2 w-full "
        onHide={() => {
          if (!visibleCancelled) return;
          setVisibleCancelled(false);
        }}
        blockScroll={true}
      >
        <div className="flex flex-col gap-8">
          <div className="text-xl">
            Apakah Anda yakin ingin membatalkan pasien {currentName} dari
            kontrol balik?
          </div>
          <div className="flex gap-4 items-end justify-end">
            <Button
              label="Tidak"
              onClick={() => setVisibleCancelled(false)}
              className="p-button-text text-mainGreen dark:text-extraLightGreen hover:text-mainDarkGreen dark:hover:text-lightGreen rounded-xl transition-all"
            />
            <Button
              disabled={isButtonLoading}
              className="bg-mainGreen w-[85px] items-center justify-center text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen flex rounded-xl transition-all"
              onClick={handleCancelled}
            >
              {isButtonLoading ? (
                <ProgressSpinner
                  style={{ width: "24px", height: "24px" }}
                  strokeWidth="8"
                  animationDuration="1s"
                  color="white"
                />
              ) : (
                <p>Iya</p>
              )}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DataKontrolBalik;
