import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { timeStampToHuman } from "../../../utils/DateConverter";
import ReusableTable from "../../../components/rousableTable/RousableTable";

const DataPengambilanObat = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/pengambilan-obat`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        const formattedData = response.data.data.map((item) => ({
          ...item,
          tanggalPengambilan: timeStampToHuman(item.tanggalPengambilan),
        }));

        setData(response.data.data);
        console.log(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { header: "No Rekam Medis", field: "pasien.noRekamMedis" },
    { header: "Nama", field: "pasien.pengguna.namaLengkap" },
    { header: "Puskesmas", field: "pasien.adminPuskesmas.namaPuskesmas" },
    { header: "Obat", field: "obat.namaObat" },
    { header: "Tanggal Pengambilan", field: "tanggalPengambilan" },
    { header: "Status", field: "status" },
  ];

  const statuses = [
    { key: "menunggu", label: "Menunggu" },
    { key: "diambil", label: "Di ambil" },
    { key: "batal", label: "batal" },
  ];

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-4 p-4 z-10 ">
      <div className="bg-white dark:bg-blackHover p-4 rounded-xl">
        <ReusableTable
          columns={columns}
          data={data}
          onDelete=""
          onUpdate=""
          onCreate=""
          statuses={statuses}
        />
      </div>
    </div>
  );
};

export default DataPengambilanObat;
