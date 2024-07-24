import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ReusableTableWithNestedData } from "../../../components/rousableTable/RousableTable";
import { timeStampToHuman } from "../../../utils/DateConverter";

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

        console.log(response.data.data);
        setData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { label: "No Rekam Medis", key: "pasien.noRekamMedis" },
    { label: "Nama", key: "pasien.pengguna.namaLengkap" },
    { label: "Puskesmas", key: "pasien.adminPuskesmas.namaPuskesmas" },
    { label: "Obat", key: "obat.namaObat" },
    { label: "Tanggal Pengambilan", key: "tanggalPengambilan" },
    { label: "Status", key: "status" },
  ];

  if (loading) return <p>Loading...</p>;
  return <ReusableTableWithNestedData columns={columns} data={data} />;
};

export default DataPengambilanObat;
