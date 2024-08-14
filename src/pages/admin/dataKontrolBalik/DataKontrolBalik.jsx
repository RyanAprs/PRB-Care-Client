import { useContext, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
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
} from "../../../utils/ApiErrorHandlers";
import { getAllPasienAktif } from "../../../services/PasienService";
import { useNavigate } from "react-router-dom";
import { HandleUnauthorizedAdminSuper } from "../../../utils/HandleUnauthorized";
import { AuthContext } from "../../../config/context/AuthContext";

const DataKontrolBalik = () => {
  const { dispatch } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState({
    idAdminPuskesmas: "",
    idPasien: "",
    tanggalKontrol: 0,
  });
  const [pasien, setPasien] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [visibleDone, setVisibleDone] = useState(false);
  const [visibleCancelled, setVisibleCancelled] = useState(false);
  const token = Cookies.get("token");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [errors, setErrors] = useState({});
  const toast = useRef(null);
  const title = "Kontrol Balik";
  const navigate = useNavigate();

  const customSort = (a, b) => {
    const statusOrder = ["menunggu", "selesai", "batal"];

    if (statusOrder.indexOf(a.status) < statusOrder.indexOf(b.status))
      return -1;
    if (statusOrder.indexOf(a.status) > statusOrder.indexOf(b.status)) return 1;
    if (a.pasien.tanggalKontrol < b.pasien.tanggalKontrol) return -1;
    if (a.pasien.tanggalKontrol > b.pasien.tanggalKontrol) return 1;

    return 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllKontrolBalik();
        const sortedData = response.sort(customSort);
        setData(sortedData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        HandleUnauthorizedAdminSuper(error.response, dispatch, navigate);

        setLoading(false);
      }
    };

    const fetchDataPasien = async () => {
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

    fetchDataPasien();
    fetchData();
  }, [token, navigate, dispatch]);

  const handleModalCreate = () => {
    setErrors({});
    setSelectedDate(null);
    setDatas({
      idAdminPuskesmas: 0,
      idPasien: 0,
      tanggalKontrol: 0,
    });
    setVisible(true);
    setIsEditMode(false);
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
      const dataResponse = await getKontrolBalikById(data.id);
      if (dataResponse) {
        const convertDate = convertUnixToHumanForEditData(
          dataResponse.tanggalKontrol
        );
        setSelectedDate(convertDate);
        setDatas({
          idAdminPuskesmas: data.pasien.adminPuskesmas.id,
          idPasien: dataResponse.idPasien,
          tanggalKontrol: dataResponse.tanggalKontrol,
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
        handleApiError(error, toast);
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

  const columns = [
    { header: "Pasien", field: "pasien.pengguna.namaLengkap" },
    { header: "Puskesmas", field: "pasien.adminPuskesmas.namaPuskesmas" },
    { header: "Tanggal Kontrol", field: "tanggalKontrol" },
    { header: "Status", field: "status" },
  ];

  const statuses = [
    { key: "menunggu", label: "Menunggu" },
    { key: "selesai", label: "Selesai" },
    { key: "batal", label: "Batal" },
  ];

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <ProgressSpinner />
      </div>
    );

  const itemTemplate = (option) => {
    return (
      <div>
        {option.pengguna.namaLengkap} - {option.adminPuskesmas.namaPuskesmas}
      </div>
    );
  };

  const valueTemplate = (option) => {
    if (option) {
      return (
        <div>
          {option.pengguna.namaLengkap} - {option.adminPuskesmas.namaPuskesmas}
        </div>
      );
    }
    return <span>Pilih Pasien</span>;
  };

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
          onCancelled={handleModalCancelled}
          statuses={statuses}
          role="admin"
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
            className="p-4 bg-lightGreen dark:bg-extraLightGreen dark:text-black hover:bg-mainGreen dark:hover:bg-lightGreen rounded-xl transition-all"
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
              className="p-button-text"
            />
            <Button
              label="Iya"
              className="rounded-xl"
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
