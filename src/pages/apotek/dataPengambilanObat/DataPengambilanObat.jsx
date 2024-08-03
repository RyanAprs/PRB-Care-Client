import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
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

const DataPengambilanObat = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [visibleDone, setVisibleDone] = useState(false);
  const token = Cookies.get("token");
  const [currentId, setCurrentId] = useState("");
  const [currentName, setCurrentName] = useState("");
  const toast = useRef(null);

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
        const responseData = await getAllPengambilanObat();
        const sortedData = responseData.sort(customSort);
        setData(sortedData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

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
        const responseData = await getAllPengambilanObat();
        const sortedData = responseData.sort(customSort);
        setData(sortedData);
      }
    } catch (error) {
      handleDoneError(error, toast);
    }
  };

  const columns = [
    { header: "Resi", field: "resi" },
    { header: "Nama Pasien", field: "pasien.pengguna.namaLengkap" },
    { header: "Puskesmas", field: "pasien.adminPuskesmas.namaPuskesmas" },
    { header: "Apotek", field: "obat.adminApotek.namaApotek" },
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
    <div className="flex flex-col gap-4 p-4 z-10 ">
      <Toast ref={toast} />

      <div className="bg-white dark:bg-blackHover p-4 rounded-xl">
        <ReusableTable
          columns={columns}
          data={data}
          onDone={handleModalDone}
          statuses={statuses}
          role="apoteker"
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
    </div>
  );
};

export default DataPengambilanObat;