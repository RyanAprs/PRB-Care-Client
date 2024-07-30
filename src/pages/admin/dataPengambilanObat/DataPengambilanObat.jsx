import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import {
  convertHumanToUnix,
  convertUnixToHuman,
} from "../../../utils/DateConverter";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { ZodError } from "zod";
import {
  handleApiError,
  handleDeleteError,
  handleDoneError,
} from "../../../utils/ApiErrorHandlers";
import { pengambilanObatSchema } from "../../../validations/PengambilanObatSchema";
import { Toast } from "primereact/toast";
import {
  createPengambilanObat,
  deletePengambilanObat,
  getAllPengambilanObat,
  getPengambilanObatById,
  PengambilanObatCancelled,
  PengambilanObatDone,
  updatePengambilanObat,
} from "../../../services/PengambilanObatService";

const DataPengambilanObat = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [datas, setDatas] = useState({
    idObat: 0,
    idPasien: 0,
    jumlah: 0,
    tanggalPengambilan: 0,
  });
  const [pasien, setPasien] = useState([]);
  const [obat, setObat] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/pengambilan-obat`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const formattedData = response.data.data.map((item) => ({
          ...item,
          tanggalPengambilan: convertUnixToHuman(item.tanggalPengambilan),
        }));

        setData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    const fetchDataPasien = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/pasien?status=aktif`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const processedData = response.data.data.map((item) => ({
          ...item,
          tanggalPeriksa: convertUnixToHuman(item.tanggalPeriksa),
        }));
        setPasien(processedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    const fetchDataObat = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/obat`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setObat(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchDataObat();
    fetchDataPasien();
    fetchData();
  }, [token]);

  const handleModalCreate = () => {
    setIsEditMode(false);
    setErrors({});
    setDatas({
      idObat: "",
      idPasien: "",
      jumlah: "",
      tanggalPengambilan: "",
    });
    setVisible(true);
  };

  const handleCreate = async () => {
    try {
      const schema = pengambilanObatSchema.parse(datas);
      console.log(schema);
      const response = await createPengambilanObat(datas);
      if (response.status === 201) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data pasien ditambahkan",
          life: 3000,
        });
        setVisible(false);
        const dataResponse = await getAllPengambilanObat();
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
      const dataResponse = await getPengambilanObatById(data.id);
      if (dataResponse) {
        const convertDate = convertUnixToHuman(dataResponse.tanggalPengambilan);
        setDatas({
          idObat: dataResponse.idObat,
          idPasien: dataResponse.idPasien,
          jumlah: dataResponse.jumlah,
          tanggalPengambilan: convertDate,
        });
        setCurrentId(data.id);
        setIsEditMode(true);
        setVisible(true);
      }
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await updatePengambilanObat(currentId, datas);
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data pengembalian obat diperbarui",
          life: 3000,
        });
        setVisible(false);
        const dataResponse = await getAllPengambilanObat();
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

  const handleModalDelete = (data) => {
    setVisibleDelete(true);
    setCurrentId(data.id);
    setCurrentName(data.pasien.pengguna.namaLengkap);
  };

  const handleDelete = async () => {
    try {
      const response = await deletePengambilanObat(currentId);
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data kontrol balik dihapus",
          life: 3000,
        });
        setVisibleDelete(false);
        const dataResponse = await getAllPengambilanObat();
        setData(dataResponse);
      }
    } catch (error) {
      handleDeleteError(error, toast, title);
    }
  };
  const handleModalDone = (data) => {
    setCurrentId(data.id);
    setCurrentName(data.pasien.pengguna.namaLengkap);
    setVisibleDone(true);
  };

  const handleDone = async () => {
    try {
      const response = await PengambilanObatDone(currentId);
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Kontrol balik berhasil diselesaikan dari kontrol balik",
          life: 3000,
        });
        setVisibleDone(false);
        const dataResponse = await getAllPengambilanObat();
        setData(dataResponse);
      }
    } catch (error) {
      handleDoneError(error, toast);
    }
  };
  const handleModalCancelled = (data) => {
    setCurrentId(data.id);
    setCurrentName(data.pasien.pengguna.namaLengkap);
    setVisibleCancelled(true);
  };

  const handleCancelled = async () => {
    try {
      const response = await PengambilanObatCancelled(currentId);
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Pasien berhasil dibatalkan dari kontrol balik",
          life: 3000,
        });
        setVisibleCancelled(false);
        const dataResponse = await getAllPengambilanObat();
        setData(dataResponse);
      }
    } catch (error) {
      handleDoneError(error, toast);
    }
  };
  const columns = [
    { header: "No Rekam Medis", field: "pasien.noRekamMedis" },
    { header: "Nama Pasien", field: "pasien.pengguna.namaLengkap" },
    { header: "Puskesmas", field: "pasien.adminPuskesmas.namaPuskesmas" },
    { header: "Apotek", field: "obat.adminApotek.namaApotek" },
    { header: "Obat", field: "obat.namaObat" },
    { header: "Jumlah Obat", field: "obat.jumlah" },
    { header: "Tanggal Pengambilan", field: "tanggalPengambilan" },
    { header: "Status", field: "status" },
  ];

  const statuses = [
    { key: "menunggu", label: "Menunggu" },
    { key: "diambil", label: "Diambil" },
    { key: "batal", label: "Batal" },
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
          onDelete={handleModalDelete}
          onEdit={handleModalUpdate}
          onCancelled={handleModalCancelled}
          onDone={handleModalDone}
          statuses={statuses}
        />
      </div>

      <Dialog
        header={
          isEditMode
            ? "Ubah Data Pengambilan Obat"
            : "Tambah Data Pengambilan Obat"
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
          <Dropdown
            value={pasien.find((p) => p.id === datas.idPasien) || null}
            options={pasien}
            filter
            optionLabel="pengguna.namaLengkap"
            placeholder="Pilih Pasien"
            className=" p-2 rounded"
            onChange={(e) => {
              const selectedPasien = e.value;
              setDatas((prev) => ({
                ...prev,
                idPasien: selectedPasien.id,
              }));
            }}
          />

          {errors.idPasien && (
            <small className="p-error -mt-3 text-sm">{errors.idPasien}</small>
          )}

          <Dropdown
            value={obat.find((o) => o.id === datas.idObat) || null}
            options={obat}
            filter
            optionLabel="namaObat"
            placeholder="Pilih Obat"
            className=" p-2 rounded"
            onChange={(e) => {
              setDatas((prev) => ({
                ...prev,
                idObat: e.value.id,
              }));
            }}
          />
          {errors.idObat && (
            <small className="p-error -mt-3 text-sm">{errors.idObat}</small>
          )}

          <InputText
            type="number"
            placeholder="Jumlah Obat"
            className="p-input text-lg p-3  rounded"
            value={datas.jumlah}
            onChange={(e) =>
              setDatas((prev) => ({
                ...prev,
                jumlah: Number(e.target.value),
              }))
            }
          />
          {errors.jumlah && (
            <small className="p-error -mt-3 text-sm">{errors.jumlah}</small>
          )}
          <Calendar
            id="buttondisplay"
            className="p-input text-lg rounded"
            placeholder="Pilih Tanggal Kontrol"
            value={isEditMode ? datas.tanggalPengambilan : selectedDate}
            onChange={(e) => {
              setSelectedDate(e.value);
              const initialDate = e.value;
              const unixTimestamp = convertHumanToUnix(initialDate);
              setDatas((prev) => ({
                ...prev,
                tanggalPengambilan: unixTimestamp,
              }));
            }}
            showIcon
            locale="id"
            showButtonBar
            readOnlyInput
            hideOnRangeSelection
          />

          {errors.tanggalPengambilan && (
            <small className="p-error -mt-3 text-sm">
              {errors.tanggalPengambilan}
            </small>
          )}
          <Button
            label={isEditMode ? "Edit" : "Simpan"}
            className="p-4 bg-lightGreen text-white rounded-xl hover:mainGreen transition-all"
            onClick={!isEditMode ? handleCreate : handleUpdate}
          />
        </div>
      </Dialog>

      <Dialog
        header="Hapus Data Pengambilan Obat"
        visible={visibleDelete}
        className="md:w-1/2 w-full "
        onHide={() => {
          if (!visibleDelete) return;
          setVisibleDelete(false);
        }}
      >
        <div className="flex flex-col gap-8">
          <div className="text-xl">
            Apakah anda yakin ingin menghapus data {currentName} dari
            pengambilan obat?
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

      <Dialog
        header="Pasien Selesai Mengambil Obat"
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
            pengambilan obat?
          </div>
          <div className="flex gap-4 items-end justify-end">
            <Button
              label="Batal"
              onClick={() => setVisibleDone(false)}
              className="p-button-text"
            />
            <Button label="Selesai" onClick={handleDone} autoFocus />
          </div>
        </div>
      </Dialog>

      <Dialog
        header="Pasien Batal Mengambil Obat"
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
            pengambilan obat?
          </div>
          <div className="flex gap-4 items-end justify-end">
            <Button
              label="Tidak"
              onClick={() => setVisibleCancelled(false)}
              className="p-button-text"
            />
            <Button label="Iya" onClick={handleCancelled} autoFocus />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DataPengambilanObat;
