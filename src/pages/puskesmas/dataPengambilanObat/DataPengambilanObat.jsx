import { useContext, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import {
  convertHumanToUnix,
  convertUnixToHumanForEditData,
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
import {
  pengambilanObatCreateSchema,
  pengambilanObatUpdateSchema,
} from "../../../validations/PengambilanObatSchema";
import { Toast } from "primereact/toast";
import {
  createPengambilanObat,
  deletePengambilanObat,
  getAllPengambilanObat,
  getPengambilanObatById,
  PengambilanObatCancelled,
  updatePengambilanObat,
} from "../../../services/PengambilanObatService";
import { getAllPasienAktif } from "../../../services/PasienService";
import { getAllObat } from "../../../services/ObatService";
import { HandleUnauthorizedAdminPuskesmas } from "../../../utils/HandleUnauthorized";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../config/context/AuthContext";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DataPengambilanObat = () => {
  const { dispatch } = useContext(AuthContext);
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
    const statusOrder = ["menunggu", "diambil", "batal"];

    if (statusOrder.indexOf(a.status) < statusOrder.indexOf(b.status))
      return -1;
    if (statusOrder.indexOf(a.status) > statusOrder.indexOf(b.status)) return 1;
    if (a.tanggalPengambilan < b.tanggalPengambilan) return -1;
    if (a.tanggalPengambilan > b.tanggalPengambilan) return 1;

    return 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPengambilanObat();
        const sortedData = response.sort(customSort);
        setData(sortedData);
        setLoading(false);
      } catch (error) {
        HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        setLoading(false);
      }
    };

    const fetchDataPasien = async () => {
      try {
        const responseData = await getAllPasienAktif();
        setPasien(responseData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        setLoading(false);
      }
    };

    const fetchDataObat = async () => {
      try {
        const responseData = await getAllObat();
        setObat(responseData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        setLoading(false);
      }
    };

    fetchDataObat();
    fetchDataPasien();
    fetchData();
  }, [token, navigate, dispatch]);

  const handleModalCreate = () => {
    setIsEditMode(false);
    setSelectedDate(null);
    setErrors({});
    setDatas({
      idObat: 0,
      idPasien: 0,
      jumlah: 0,
      tanggalPengambilan: 0,
    });
    setVisible(true);
  };

  const handleCreate = async () => {
    try {
      pengambilanObatCreateSchema.parse(datas);
      const response = await createPengambilanObat(datas);
      if (response.status === 201) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data pasien ditambahkan",
          life: 3000,
        });
        setVisible(false);
        const responseData = await getAllPengambilanObat();
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
      tanggalPengambilan: unixTimestamp,
    }));
  };

  const handleModalUpdate = async (data) => {
    setErrors({});
    try {
      const dataResponse = await getPengambilanObatById(data.id);
      if (dataResponse) {
        const convertDate = convertUnixToHumanForEditData(
          dataResponse.tanggalPengambilan
        );
        setSelectedDate(convertDate);
        setDatas({
          idObat: dataResponse.idObat,
          idPasien: dataResponse.idPasien,
          jumlah: dataResponse.jumlah,
          tanggalPengambilan: dataResponse.tanggalPengambilan,
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
      pengambilanObatUpdateSchema.parse(datas);

      const updatedData = {
        ...datas,
        tanggalPengambilan: convertHumanToUnix(selectedDate),
      };

      const response = await updatePengambilanObat(currentId, updatedData);

      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data pengembalian obat diperbarui",
          life: 3000,
        });

        setVisible(false);

        const responseData = await getAllPengambilanObat();
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
        HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
        handleApiError(error, toast);
      }
    }
  };

  const handleModalDelete = (data) => {
    setVisibleDelete(true);
    setCurrentId(data.id);
    setCurrentName(data.resi);
  };

  const handleDelete = async () => {
    try {
      const response = await deletePengambilanObat(currentId);
      console.log(response);

      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Berhasil",
          detail: "Data kontrol balik dihapus",
          life: 3000,
        });
        setVisibleDelete(false);
        const responseData = await getAllPengambilanObat();
        const sortedData = responseData.sort(customSort);
        setData(sortedData);
      }
    } catch (error) {
      HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
      handleDeleteError(error, toast, title);
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
        const responseData = await getAllPengambilanObat();
        const sortedData = responseData.sort(customSort);
        setData(sortedData);
      }
    } catch (error) {
      HandleUnauthorizedAdminPuskesmas(error.response, dispatch, navigate);
      handleDoneError(error, toast);
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();

    doc.text("Data Pengambilan Obat", 20, 10);

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

    doc.save("data-pengambilan-obat.pdf");
  };

  const columns = [
    { header: "Resi", field: "resi" },
    
    { header: "Nama Pasien", field: "pasien.pengguna.namaLengkap" },
    { header: "No Rekam Medis", field: "pasien.noRekamMedis" },
    { header: "Nama Apotek", field: "obat.adminApotek.namaApotek" },
    { header: "Telepon Apotek", field: "obat.adminApotek.telepon" },
    { header: "Obat", field: "obat.namaObat" },
    { header: "Jumlah Obat", field: "jumlah" },
    { header: "Tanggal Pengambilan", field: "tanggalPengambilan" },
    { header: "Status", field: "status" },
  ];

  const statuses = [
    { key: "menunggu", label: "Menunggu" },
    { key: "diambil", label: "Diambil" },
    { key: "batal", label: "Batal" },
  ];

  const itemTemplatePengguna = (option) => {
    return (
      <div>
        {option.pengguna.namaLengkap} - {option.noRekamMedis}
      </div>
    );
  };

  const valueTemplatePengguna = (option) => {
    if (option) {
      return (
        <div>
          {option.pengguna.namaLengkap} - {option.noRekamMedis}
        </div>
      );
    }
    return <span>Pilih Pasien</span>;
  };
  const itemTemplateObat = (option) => {
    return (
      <div>
        {option.namaObat} - Stock: {option.jumlah}, {option.adminApotek.namaApotek} -{" "}
        {option.adminApotek.telepon}
      </div>
    );
  };

  const valueTemplateObat = (option) => {
    if (option) {
      return (
        <div>
          {option.namaObat} - Stock: {option.jumlah}, {option.adminApotek.namaApotek} -{" "}
          {option.adminApotek.telepon}
        </div>
      );
    }
    return <span>Pilih Obat</span>;
  };

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <ProgressSpinner />
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col gap-4 p-4 z-10 ">
      <Toast
        ref={toast}
        position={window.innerWidth <= 767 ? "top-center" : "top-right"}
      />

      <div className="bg-white dark:bg-blackHover p-4 rounded-xl">
        <ReusableTable
          columns={columns}
          data={data}
          onCreate={handleModalCreate}
          onDelete={handleModalDelete}
          onEdit={handleModalUpdate}
          onCancelled={handleModalCancelled}
          onDone=""
          statuses={statuses}
          role="nakes"
          path="pengambilanObat"
          onDownload={handleDownload}
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
          <label htmlFor="" className="-mb-3">
            Pilih pasien:
          </label>

          <Dropdown
            value={pasien.find((p) => p.id === datas.idPasien) || null}
            options={pasien}
            itemTemplate={itemTemplatePengguna}
            valueTemplate={valueTemplatePengguna}
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
          <label htmlFor="" className="-mb-3">
            Pilih obat:
          </label>

          <Dropdown
            value={obat.find((o) => o.id === datas.idObat) || null}
            options={obat}
            itemTemplate={itemTemplateObat}
            valueTemplate={valueTemplateObat}
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
          <label htmlFor="" className="-mb-3">
            Jumlah obat:
          </label>

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
          <label htmlFor="" className="-mb-3">
            Tanggal pengambilan obat:
          </label>

          <Calendar
            id="buttondisplay"
            className="p-input text-lg rounded"
            placeholder="Pilih Tanggal Pengambilan"
            value={selectedDate}
            onChange={handleCalendarChange}
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
            className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen p-4 w-full flex justify-center rounded-xl hover:mainGreen transition-all"
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
            Apakah anda yakin ingin menghapus data resi {currentName} dari
            pengambilan obat?
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
            Apakah Anda yakin ingin membatalkan resi {currentName} dari
            pengambilan obat?
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

export default DataPengambilanObat;
