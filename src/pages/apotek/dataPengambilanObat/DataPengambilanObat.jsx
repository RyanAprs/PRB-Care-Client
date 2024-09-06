import { useContext, useEffect, useRef, useState } from "react";
import ReusableTable from "../../../components/rousableTable/RousableTable";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { handleDoneError } from "../../../utils/ApiErrorHandlers";
import { Toast } from "primereact/toast";
import {
  getAllPengambilanObat,
  PengambilanObatDone,
} from "../../../services/PengambilanObatService";
import { HandleUnauthorizedAdminApotek } from "../../../utils/HandleUnauthorized";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../config/context/AuthContext";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ErrorConnection from "../../../components/errorConnection/ErrorConnection";
import ModalLoading from "/src/components/modalLoading/ModalLoading.jsx";

const DataPengambilanObat = () => {
  const [beforeModalLoading, setBeforeModalLoading] = useState(false);
  const { dispatch } = useContext(AuthContext);
  const [visibleDone, setVisibleDone] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const [currentId, setCurrentId] = useState("");
  const [currentName, setCurrentName] = useState("");
  const toast = useRef(null);
  const navigate = useNavigate();
  const [isConnectionError, setisConnectionError] = useState(false);
  const [isButtonLoading, setButtonLoading] = useState(null);

  const customSort = (a, b) => {
    const statusOrder = ["menunggu", "diambil", "batal"];

    if (statusOrder.indexOf(a.status) < statusOrder.indexOf(b.status))
      return -1;
    if (statusOrder.indexOf(a.status) > statusOrder.indexOf(b.status)) return 1;
    if (a.tanggalPengambilan < b.tanggalPengambilan) return -1;
    if (a.tanggalPengambilan > b.tanggalPengambilan) return 1;

    return 0;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAllPengambilanObat();
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
      HandleUnauthorizedAdminApotek(error.response, dispatch, navigate);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [token, navigate, dispatch]);

  const handleModalDone = (data) => {
    setBeforeModalLoading(true);
    setCurrentId(data.id);
    setCurrentName(data.resi);
    setVisibleDone(true);
    setBeforeModalLoading(false);
  };

  const handleDone = async () => {
    try {
      setButtonLoading(true);
      const response = await PengambilanObatDone(currentId);
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
          const response = await getAllPengambilanObat();
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
          HandleUnauthorizedAdminApotek(error.response, dispatch, navigate);
          setLoading(false);
        }
      }
    } catch (error) {
      HandleUnauthorizedAdminApotek(error.response, dispatch, navigate);
      handleDoneError(error, toast);
    } finally {
      setButtonLoading(false);
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
    { header: "Telepon Pasien", field: "pasien.pengguna.telepon" },
    {
      header: "Telepon Keluarga Pasien",
      field: "pasien.pengguna.teleponKeluarga",
    },
    { header: "Alamat Pasien", field: "pasien.pengguna.alamat" },
    { header: "Nama Puskesmas", field: "pasien.adminPuskesmas.namaPuskesmas" },
    { header: "Telepon Puskesmas", field: "pasien.adminPuskesmas.telepon" },
    { header: "Alamat Puskesmas", field: "pasien.adminPuskesmas.alamat" },
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
          onDone={handleModalDone}
          statuses={statuses}
          onDownload={handleDownload}
          role="apoteker"
          path="pengambilanObatApoteker"
        />
      </div>

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
            Apakah Anda yakin ingin menyelesaikan resi {currentName} dari
            pengambilan obat?
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

export default DataPengambilanObat;
