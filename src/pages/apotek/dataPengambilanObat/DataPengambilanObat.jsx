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
import jsPDF from "jspdf";
import "jspdf-autotable";

const DataPengambilanObat = () => {
  const { dispatch } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const [currentId, setCurrentId] = useState("");
  const [currentName, setCurrentName] = useState("");
  const toast = useRef(null);
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
        console.error("Error fetching data:", error);
        HandleUnauthorizedAdminApotek(error.response, dispatch, navigate);
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate, dispatch]);

  const handleModalDone = (data) => {
    setCurrentId(data.id);
    setCurrentName(data.resi);
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
        const responseData = await getAllPengambilanObat();
        const sortedData = responseData.sort(customSort);
        setData(sortedData);
      }
    } catch (error) {
      HandleUnauthorizedAdminApotek(error.response, dispatch, navigate);
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
              label="Selesai"
              className="bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen flex justify-center rounded-xl hover:mainGreen transition-all"
              onClick={handleDone}
              autoFocus
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default DataPengambilanObat;
