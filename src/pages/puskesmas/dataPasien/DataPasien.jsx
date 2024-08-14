import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import {
  convertHumanToUnix,
  convertUnixToHuman,
  convertUnixToHumanForEditData,
  dateLocaleId,
} from "../../../utils/DateConverter";
import { Calendar } from "primereact/calendar";
import { addLocale } from "primereact/api";
import {
  pasienCreateSchemaAdminPuskesmas,
  pasienUpdateSchemaAdminPuskesmas,
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
import { getAllPengguna } from "../../../services/PenggunaService";
import { useNavigate } from "react-router-dom";
import { HandleUnauthorizedAdminPuskesmas } from "../../../utils/HandleUnauthorized";
import { AuthContext } from "../../../config/context/AuthContext";

addLocale("id", dateLocaleId);

const DataPasien = () => {
  const { dispatch } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleDone, setVisibleDone] = useState(false);
  const [pengguna, setPengguna] = useState([]);
  const [datas, setDatas] = useState({
    noRekamMedis: "",
    idAdminPuskesmas: "",
    idPengguna: "",
    beratBadan: 0,
    tinggiBadan: 0,
    tekananDarah: "",
    denyutNadi: 0,
    hasilLab: "",
    hasilEkg: "",
    tanggalPeriksa: 0,
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [errors, setErrors] = useState({});
  const toast = useRef(null);
  const title = "Pasien";
  const navigate = useNavigate();

  const customSort = (a, b) => {
    if (a.status < b.status) return -1;
    if (a.status > b.status) return 1;
    if (a.tanggalPeriksa < b.tanggalPeriksa) return -1;
    if (a.tanggalPeriksa > b.tanggalPeriksa) return 1;
    return 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/pasien`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const formatedData = response.data.data.map((item) => ({
          ...item,
          tanggalPeriksa: convertUnixToHuman(item.tanggalPeriksa),
        }));
        const sortedData = formatedData.sort(customSort);
        setData(sortedData);
        setLoading(false);
      } catch (error) {
        HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        setLoading(false);
      }
    };

    const fetchDataPengguna = async () => {
      try {
        const response = await getAllPengguna();
        setPengguna(response);
        setLoading(false);
      } catch (error) {
        HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        setLoading(false);
      }
    };

    fetchDataPengguna();
    fetchData();
  }, [token, navigate, dispatch]);

  const handleModalCreate = () => {
    setErrors({});
    setSelectedDate(null);
    setDatas({
      noRekamMedis: "",
      idPengguna: 0,
      beratBadan: 0,
      tinggiBadan: 0,
      tekananDarah: "",
      denyutNadi: 0,
      hasilLab: "",
      hasilEkg: "",
      tanggalPeriksa: 0,
    });
    setVisible(true);
    setIsEditMode(false);
  };

  const handleCreate = async () => {
    try {
      pasienCreateSchemaAdminPuskesmas.parse(datas);
      const response = await createPasien(datas);
      if (response.status === 201) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data pasien ditambahkan",
          life: 3000,
        });
        setVisible(false);
        const responseData = await getAllPasien();
        setData(responseData);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors = {};
        error.errors.forEach((e) => {
          newErrors[e.path[0]] = e.message;
        });
        setErrors(newErrors);
      } else {
        HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        handleApiError(error, toast);
      }
    }
  };

  const handleCalendarChange = (e) => {
    setSelectedDate(e.value);
    const unixTimestamp = convertHumanToUnix(e.value);
    setDatas((prev) => ({
      ...prev,
      tanggalPeriksa: unixTimestamp,
    }));
  };

  const handleModalUpdate = async (data) => {
    setErrors({});
    try {
      const dataResponse = await getPasienById(data.id);
      if (dataResponse) {
        const convertDate = convertUnixToHumanForEditData(
          dataResponse.tanggalPeriksa
        );
        setSelectedDate(convertDate);
        setDatas({
          noRekamMedis: dataResponse.noRekamMedis,
          idPengguna: dataResponse.idPengguna,
          beratBadan: dataResponse.beratBadan,
          tinggiBadan: dataResponse.tinggiBadan,
          tekananDarah: dataResponse.tekananDarah,
          denyutNadi: dataResponse.denyutNadi,
          hasilLab: dataResponse.hasilLab,
          hasilEkg: dataResponse.hasilEkg,
          tanggalPeriksa: dataResponse.tanggalPeriksa,
        });
        setCurrentId(data.id);
        setIsEditMode(true);
        setVisible(true);
      }
    } catch (error) {
      HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
      handleApiError(error, toast);
    }
  };
  const handleUpdate = async () => {
    try {
      pasienUpdateSchemaAdminPuskesmas.parse(datas);
      const response = await updatePasien(currentId, datas);
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data pasien diperbarui",
          life: 3000,
        });
        setVisible(false);
        const responseData = await getAllPasien();
        setData(responseData);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors = {};
        error.errors.forEach((e) => {
          newErrors[e.path[0]] = e.message;
        });
        setErrors(newErrors);
      } else {
        HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        handleApiError(error, toast);
      }
    }
  };

  const handleModalDelete = async (data) => {
    setCurrentId(data.id);
    setCurrentName(data.noRekamMedis);
    setVisibleDelete(true);
  };

  const handleDelete = async () => {
    try {
      const response = await deletePasien(currentId);
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data pasien dihapus",
          life: 3000,
        });
        setVisibleDelete(false);
        const responseData = await getAllPasien();
        setData(responseData);
      }
    } catch (error) {
      HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
      handleDeleteError(error, toast, title);
    }
  };

  const handleModalDone = async (data) => {
    setCurrentId(data.id);
    setCurrentName(data.noRekamMedis);
    setVisibleDone(true);
  };

  const handleDone = async () => {
    try {
      const response = await pasienDone(currentId);
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Pasien berhasil diselesaikan",
          life: 3000,
        });
        setVisibleDone(false);
        const responseData = await getAllPasien();
        setData(responseData);
      }
    } catch (error) {
      HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
      handleDoneError(error, toast);
    }
  };

  const columns = [
    { header: "Nomor Rekam Medis", field: "noRekamMedis" },
    { header: "Nama Lengkap", field: "pengguna.namaLengkap" },
    { header: "Telepon", field: "pengguna.telepon" },
    { header: "Telepon Keluarga", field: "pengguna.teleponKeluarga" },
    { header: "Alamat", field: "pengguna.alamat" },
    { header: "Berat Badan", field: "beratBadan" },
    { header: "Tinggi Badan", field: "tinggiBadan" },
    { header: "Tekanan Darah", field: "tekananDarah" },
    { header: "Denyut Nadi", field: "denyutNadi" },
    { header: "Hasil Lab", field: "hasilLab" },
    { header: "Hasil EKG", field: "hasilEkg" },
    { header: "Tanggal Periksa", field: "tanggalPeriksa" },
    { header: "Status", field: "status" },
  ];

  const statuses = [
    { key: "aktif", label: "Aktif" },
    { key: "selesai", label: "Selesai" },
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
          onCreate={handleModalCreate}
          onEdit={handleModalUpdate}
          onDelete={handleModalDelete}
          onDone={handleModalDone}
          statuses={statuses}
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
      >
        <div className="flex flex-col p-4 gap-4">
          <label htmlFor="" className="-mb-3">
            Nomor rekam medis:
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
            Pilih pengguna:
          </label>

          <Dropdown
            value={
              pengguna.find((pengguna) => pengguna.id === datas.idPengguna) ||
              null
            }
            options={pengguna}
            filter
            optionLabel="namaLengkap"
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
            <small className="p-error -mt-3 text-sm">{errors.beratBadan}</small>
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
            <small className="p-error -mt-3 text-sm">{errors.denyutNadi}</small>
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
            <small className="p-error -mt-3 text-sm">{errors.hasilLab}</small>
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
            <small className="p-error -mt-3 text-sm">{errors.hasilEkg}</small>
          )}
          <label htmlFor="" className="-mb-3">
            Tanggal periksa:
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

          {errors.tanggalPeriksa && (
            <small className="p-error -mt-3 text-sm">
              {errors.tanggalPeriksa}
            </small>
          )}
          <Button
            label={isEditMode ? "Edit" : "Simpan"}
            className="p-4 bg-lightGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainGreen dark:hover:bg-lightGreen rounded-xl transition-all"
            onClick={isEditMode ? handleUpdate : handleCreate}
          />
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
              className="p-button-text"
            />
            <Button
              label="Hapus"
              className="rounded-xl"
              onClick={handleDelete}
              autoFocus
            />
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
              className="p-button-text"
            />
            <Button
              label="Selesai"
              className="rounded-xl"
              onClick={handleDone}
              autoFocus
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DataPasien;
