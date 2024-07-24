import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ReusableTableWithNestedData } from "../../../components/rousableTable/RousableTable";
import { timeStampToHuman } from "../../../utils/DateConverter";

const DataKontrolBalik = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URI}/api/kontrol-balik`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        const formattedData = response.data.data.map((item) => ({
          ...item,
          tanggalKontrol: timeStampToHuman(item.tanggalKontrol),
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
    { label: "Tanggal Kontrol", key: "tanggalKontrol" },
    { label: "Status", key: "status" },
  ];

  if (loading) return <p>Loading...</p>;
  return <ReusableTableWithNestedData columns={columns} data={data} />;
};

export default DataKontrolBalik;
