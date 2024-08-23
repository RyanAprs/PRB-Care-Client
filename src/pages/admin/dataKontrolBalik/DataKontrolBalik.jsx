import { useContext, useEffect, useRef, useState } from "react";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import {
  convertHumanToUnix,
  convertUnixToHumanForEditData,
} from "../../../utils/DateConverter";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
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
  handleApiError,
  handleDeleteError,
  handleDoneError,
  handleKontrolBalikError,
} from "../../../utils/ApiErrorHandlers";
import { getAllPasienAktif } from "../../../services/PasienService";
import { useNavigate } from "react-router-dom";
import { HandleUnauthorizedAdminSuper } from "../../../utils/HandleUnauthorized";
import { AuthContext } from "../../../config/context/AuthContext";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import ErrorConnection from "../../../components/errorConnection/ErrorConnection";

const DataKontrolBalik = () => {
  const { dispatch } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState({
    noAntrean: 0,
    idAdminPuskesmas: "",
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

  const customSort = (a, b) => {
    const statusOrder = ["menunggu", "selesai", "batal"];

    if (statusOrder.indexOf(a.status) < statusOrder.indexOf(b.status))
      return -1;
    if (statusOrder.indexOf(a.status) > statusOrder.indexOf(b.status)) return 1;
    if (a.pasien.tanggalKontrol < b.pasien.tanggalKontrol) return -1;
    if (a.pasien.tanggalKontrol > b.pasien.tanggalKontrol) return 1;

    return 0;
  };

  const fetchData = async () => {
    try {
      const response = await getAllKontrolBalik();
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
    setErrors({});
    setSelectedDate(null);
    setDatas({
      noAntrean: 0,
      idAdminPuskesmas: 0,
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
    setVisible(true);
    setIsEditMode(false);
    try {
      const response = await getAllPasienAktif();
      setPasien(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
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
        const responseData = await getAllKontrolBalik();
        const sortedData = responseData.sort(customSort);
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
      tanggalKontrol: unixTimestamp,
    }));
  };

  const handleModalUpdate = async (data) => {
    setErrors({});
    try {
      const response = await getAllPasienAktif();
      setPasien(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
      setLoading(false);
    }
    try {
      const dataResponse = await getKontrolBalikById(data.id);

      if (dataResponse) {
        const convertDate = convertUnixToHumanForEditData(
          dataResponse.tanggalKontrol
        );
        setSelectedDate(convertDate);
        setDatas({
          noAntrean: dataResponse.noAntrean,
          idAdminPuskesmas: data.pasien.adminPuskesmas.id,
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
        setVisible(true);
      }
    } catch (error) {
      HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
      handleApiError(error, toast);
    }
  };

  const handleUpdate = async () => {
    try {
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
        const responseData = await getAllKontrolBalik();
        const sortedData = responseData.sort(customSort);
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
        HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
        handleKontrolBalikError(error, toast);
      }
    }
  };

  const handleModalDelete = (data) => {
    setVisibleDelete(true);
    setCurrentId(data.id);
    setCurrentName(data.pasien.pengguna.namaLengkap);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteKontrolBalik(currentId);
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data kontrol balik dihapus",
          life: 3000,
        });
        setVisibleDelete(false);
        const responseData = await getAllKontrolBalik();
        const sortedData = responseData.sort(customSort);
        setData(sortedData);
      }
    } catch (error) {
      HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
      handleDeleteError(error, toast, title);
    }
  };

  const handleModalDone = async (data) => {
    setCurrentId(data.id);
    setCurrentName(data.pasien.pengguna.namaLengkap);
    setVisibleDone(true);
  };

  const handleDone = async () => {
    try {
      const response = await kontrolBalikDone(currentId);
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Kontrol balik berhasil diselesaikan dari kontrol balik",
          life: 3000,
        });
        setVisibleDone(false);
        const responseData = await getAllKontrolBalik();
        const sortedData = responseData.sort(customSort);
        setData(sortedData);
      }
    } catch (error) {
      HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
      handleDoneError(error, toast);
    }
  };

  const handleModalCancelled = async (data) => {
    setCurrentId(data.id);
    setCurrentName(data.pasien.pengguna.namaLengkap);
    setVisibleCancelled(true);
  };

  const handleCancelled = async () => {
    try {
      const response = await kontrolBalikCancelled(currentId);
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Pasien berhasil dibatalkan dari kontrol balik",
          life: 3000,
        });
        setVisibleCancelled(false);
        const responseData = await getAllKontrolBalik();
        const sortedData = responseData.sort(customSort);
        setData(sortedData);
      }
    } catch (error) {
      HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);
      handleDoneError(error, toast);
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
    { header: "Pasien", field: "pasien.pengguna.namaLengkap" },
    { header: "Puskesmas", field: "pasien.adminPuskesmas.namaPuskesmas" },
    { header: "Tanggal Kontrol", field: "tanggalKontrol" },
    { header: "Nomor Antrean", field: "noAntrean" },
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
        <div className="bg-white min-h-screen dark:bg-blackHover p-4 rounded-xl flex items-center justify-center">
          <ProgressSpinner />
        </div>
      </div>
    );

  if (isConnectionError) {
    return <ErrorConnection fetchData={fetchData} />;
  }

  const itemTemplate = (option) => {
    return (
      <div>
        {option.pengguna.namaLengkap} - {option.noRekamMedis},{" "}
        {option.adminPuskesmas.namaPuskesmas} - {option.adminPuskesmas.telepon}
      </div>
    );
  };

  const valueTemplate = (option) => {
    if (option) {
      return (
        <div>
          {option.pengguna.namaLengkap} - {option.noRekamMedis},{" "}
          {option.adminPuskesmas.namaPuskesmas} -{" "}
          {option.adminPuskesmas.telepon}
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
      <div className="bg-white min-h-screen dark:bg-blackHover rounded-xl">
        <ReusableTable
          columns={columns}
          data={data}
          onCreate={handleModalCreate}
          onEdit={handleModalUpdate}
          onDelete={handleModalDelete}
          onDone={handleModalDone}
          onCancelled={handleModalCancelled}
          statuses={statuses}
          role="admin"
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
      >
        <div className="flex flex-col p-4 gap-4">
          {isEditMode && (
            <>
              <label htmlFor="" className="-mb-3">
                Nomor Atrean:
              </label>

              <InputText
                type="number"
                placeholder="Nomor Antrean"
                className="p-input  text-lg p-3  rounded"
                value={datas.noAntrean}
                onChange={(e) =>
                  setDatas((prev) => ({
                    ...prev,
                    noAntrean: Number(e.target.value),
                  }))
                }
              />
              {errors.noAntrean && (
                <small className="p-error -mt-3 text-sm">
                  {errors.noAntrean}
                </small>
              )}
            </>
          )}
          <label htmlFor="" className="-mb-3">
            Pilih pasien:
          </label>

          <Dropdown
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
                idAdminPuskesmas: selectedPasien.adminPuskesmas.id,
              }));
            }}
          />

          {errors.idPasien && (
            <small className="p-error -mt-3 text-sm">{errors.idPasien}</small>
          )}

          {isEditMode && (
            <>
              <label htmlFor="" className="-mb-3">
                Tinggi badan:
              </label>

              <InputText
                type="number"
                placeholder="Tinggi Badan"
                className="p-input  text-lg p-3  rounded"
                value={datas.tinggiBadan}
                onChange={(e) =>
                  setDatas((prev) => ({
                    ...prev,
                    tinggiBadan: Number(e.target.value),
                  }))
                }
              />
              {errors.tinggiBadan && (
                <small className="p-error -mt-3 text-sm">
                  {errors.tinggiBadan}
                </small>
              )}
              <label htmlFor="" className="-mb-3">
                Berat badan:
              </label>

              <InputText
                type="number"
                placeholder="Berat Badan"
                className="p-input text-lg p-3  rounded"
                value={datas.beratBadan}
                onChange={(e) =>
                  setDatas((prev) => ({
                    ...prev,
                    beratBadan: Number(e.target.value),
                  }))
                }
              />
              {errors.beratBadan && (
                <small className="p-error -mt-3 text-sm">
                  {errors.beratBadan}
                </small>
              )}
              <label htmlFor="" className="-mb-3">
                Tekanan darah:
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
                Denyut nadi:
              </label>

              <InputText
                type="number"
                placeholder="Denyut Nadi"
                className="p-input text-lg p-3  rounded"
                value={datas.denyutNadi}
                onChange={(e) =>
                  setDatas((prev) => ({
                    ...prev,
                    denyutNadi: Number(e.target.value),
                  }))
                }
              />
              {errors.denyutNadi && (
                <small className="p-error -mt-3 text-sm">
                  {errors.denyutNadi}
                </small>
              )}
              <label htmlFor="" className="-mb-3">
                Hasil lab:
              </label>

              <InputTextarea
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
                Hasil ekg:
              </label>

              <InputTextarea
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
                Hasil Diagnosa:
              </label>

              <InputTextarea
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
              <label htmlFor="" className="-mb-3">
                Keluhan:
              </label>

              <InputTextarea
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
              {errors.keluhan && (
                <small className="p-error -mt-3 text-sm">
                  {errors.keluhan}
                </small>
              )}
            </>
          )}

          <label htmlFor="" className="-mb-3">
            Pilih tanggal kontrol:{" "}
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
            label={isEditMode ? "Edit" : "Simpan"}
            className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen p-4 w-full flex justify-center rounded-xl hover:mainGreen transition-all"
            onClick={isEditMode ? handleUpdate : handleCreate}
          />
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
              label="Hapus"
              className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen flex justify-center rounded-xl hover:mainGreen transition-all"
              onClick={handleDelete}
              autoFocus
            />
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
              label="Selesai"
              className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen flex justify-center rounded-xl hover:mainGreen transition-all"
              onClick={handleDone}
              autoFocus
            />
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
              label="Iya"
              className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen flex justify-center rounded-xl hover:mainGreen transition-all"
              onClick={handleCancelled}
              autoFocus
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DataKontrolBalik;
